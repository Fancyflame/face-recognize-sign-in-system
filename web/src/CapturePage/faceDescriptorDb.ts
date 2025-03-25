import { FaceMatch, FaceMatcher, LabeledFaceDescriptors } from "face-api.js";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ClassroomClient } from "../../generated/Remote_signinServiceClientPb";
import { GetDetailsReq, Student } from "../../generated/remote_signin_pb";
import { useClassroomClient } from "../classroomClient";
import { LocalStudent } from "../SignInPage";

const THRESHOLD = 0.5;
const REMOTE_DB_ADDR = "http://localhost:10000";

export interface FaceDescDb {
    matchFace(desciptor: Float32Array): LocalStudent | undefined;
}

export function useFaceDescDb(students: Map<string, LocalStudent>): FaceDescDb {
    const matcher = useMemo(() => {
        if (!students.size) {
            return null;
        }

        return new FaceMatcher(
            students
                .values()
                .map(
                    (stu) =>
                        new LabeledFaceDescriptors(stu.id, [
                            stu.faceDescriptor,
                        ]),
                )
                .toArray(),
        );
    }, [students]);

    return {
        matchFace(desciptor) {
            if (!matcher) return undefined;

            const bestMatch = matcher.matchDescriptor(desciptor);
            if (bestMatch.distance < THRESHOLD) {
                const student = students.get(bestMatch.label);
                if (!student) throw "expected defined";
                return student;
            } else {
                return undefined;
            }
        },
    };
}
