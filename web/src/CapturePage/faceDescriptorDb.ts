import { FaceMatcher, LabeledFaceDescriptors } from "face-api.js";
import { useMemo } from "react";
import { LocalStudent } from "../SignInPage";

const THRESHOLD = 0.3;

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
