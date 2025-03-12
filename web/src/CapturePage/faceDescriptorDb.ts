import { FaceMatch, FaceMatcher, LabeledFaceDescriptors } from "face-api.js";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ClassroomClient } from "../../generated/Remote_signinServiceClientPb";
import { GetStudentsReq, Student } from "../../generated/remote_signin_pb";
import { useClassroomClient } from "../classroomClient";

const THRESHOLD = 0.5;
const REMOTE_DB_ADDR = "http://localhost:10000";

export interface FaceDescDb {
    matchFace(desciptor: Float32Array): Student | undefined;
}

export function useFaceDescDb(classroom_id: string): FaceDescDb {
    const [students, setStudents] = useState<Student[]>([]);

    const client = useClassroomClient();

    useEffect(() => {
        const req = new GetStudentsReq();
        req.setClassroomId(classroom_id);
        client.getStudents(req, null, (_, res) => {
            const students = res.getOk()?.getStudentsList();
            if (students) {
                setStudents(students);
            } else {
                console.warn("无法获取学生列表");
            }
        });
    }, [classroom_id]);

    const matcher = useMemo(() => {
        if (!students.length) {
            return null;
        }

        return new FaceMatcher(
            students.map(
                (stu) =>
                    new LabeledFaceDescriptors(stu.getId(), [
                        new Float32Array(stu.getFaceDescriptorList()),
                    ]),
            ),
        );
    }, [students]);

    const studentMap = useMemo(() => {
        return new Map(students.map((stu) => [stu.getId(), stu]));
    }, [students]);

    return {
        matchFace(desciptor) {
            if (!matcher) return undefined;

            const bestMatch = matcher.matchDescriptor(desciptor);
            if (bestMatch.distance < THRESHOLD) {
                const student = studentMap.get(bestMatch.label);
                if (!student) throw "expected defined";
                return student;
            } else {
                return undefined;
            }
        },
    };
}
