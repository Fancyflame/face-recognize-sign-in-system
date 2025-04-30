import * as testDescriptors from "./testDescriptors";
import { useFaceDescDb } from "./faceDescriptorDb";
import { Student } from "../../generated/remote_signin_pb";
import { useEffect, useState } from "react";
import { StudentsInfoProps } from ".";
import { runModel } from "../faceApiLocal";

// 获得face api识别返回值的单个检测结果类型
export type DetectionResult = Awaited<
    ReturnType<typeof runModel>
> extends Array<infer E>
    ? E
    : never;

const COLOR_RECOGNIZED = "#54fe9b";
const COLOR_UNRECOGNIZED = "#e84118";

export interface MarkedDetection {
    detection: DetectionResult;
    isMatched: boolean;
}

export function useMatchFace(
    detections: DetectionResult[],
    info: StudentsInfoProps,
) {
    const [markedDetections, setMarkedDetections] = useState<MarkedDetection[]>(
        [],
    );
    const db = useFaceDescDb(info.students);

    useEffect(() => {
        const newlyInsert: string[] = [];

        const marked = detections.map((det) => {
            const matches = db.matchFace(det.descriptor);
            if (matches && !info.signedInList.has(matches.id)) {
                newlyInsert.push(matches.id);
            }

            return {
                detection: det,
                isMatched: Boolean(matches),
            };
        });
        setMarkedDetections(marked);

        if (newlyInsert.length) {
            const newSet = new Set(info.signedInList);
            for (const stuId of newlyInsert) {
                newSet.add(stuId);
            }
            info.setSignedInList(newSet);
        }
    }, [detections]);

    return { markedDetections };
}

export interface FaceDetectionsBoxProps {
    video: HTMLVideoElement;
    detections: MarkedDetection[];
}

export function FaceDetectionsBox(props: FaceDetectionsBoxProps) {
    const { video, detections } = props;
    const videoBox = getVideoDisplayRect(video);

    return detections.map(({ detection, isMatched }, index) => {
        const { x, y, width, height } = detection.alignedRect.relativeBox;

        return (
            <div
                key={index} // 因为div没有什么状态，所以直接用index作为key屏蔽警告就行
                style={{
                    position: "fixed",
                    left: video.clientLeft + videoBox.x + x * videoBox.width,
                    top: video.clientTop + videoBox.y + y * videoBox.height,
                    width: width * videoBox.width,
                    height: height * videoBox.height,
                    border: `3px solid ${
                        isMatched ? COLOR_RECOGNIZED : COLOR_UNRECOGNIZED
                    }`,
                    borderRadius: 5,
                }}
            ></div>
        );
    });
}

function getVideoDisplayRect(video: HTMLVideoElement) {
    const cw = video.clientWidth;
    const ch = video.clientHeight;
    const videoRatio = video.videoWidth / video.videoHeight;
    const elementRatio = cw / ch;

    if (videoRatio > elementRatio) {
        return {
            width: cw,
            height: cw / videoRatio,
            x: 0,
            y: (ch - cw / videoRatio) / 2,
        };
    } else {
        return {
            width: ch * videoRatio,
            height: ch,
            x: (cw - ch * videoRatio) / 2,
            y: 0,
        };
    }
}
