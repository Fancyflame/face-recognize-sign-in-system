import * as faceapi from "face-api.js";
import * as testDescriptors from "./testDescriptors";

export type DetectionResults = Awaited<ReturnType<typeof runModel>>;

export async function loadModel(pathDir: string) {
    // await faceapi.loadMtcnnModel(pathDir);
    await faceapi.loadSsdMobilenetv1Model(pathDir);
    await faceapi.loadFaceDetectionModel(pathDir);
    await faceapi.loadFaceLandmarkModel(pathDir);
    await faceapi.loadFaceRecognitionModel(pathDir);
    console.log("模型已加载");
}

export async function runModel(video: HTMLVideoElement) {
    return await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks(false)
        .withFaceDescriptors();
}

const COLOR_RECOGNIZED = "#54fe9b";
const COLOR_UNRECOGNIZED = "#e84118";
const FACE_MATCHER = new faceapi.FaceMatcher(
    new Float32Array(testDescriptors.ME),
);

export function faceDetectionsToDivs(
    video: HTMLVideoElement,
    detections: DetectionResults,
) {
    const videoBox = getVideoDisplayRect(video);

    return detections.map((det, index) => {
        const { x, y, width, height } = det.alignedRect.relativeBox;
        const matches =
            FACE_MATCHER.findBestMatch(det.descriptor).distance < 0.4;

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
                        matches ? COLOR_RECOGNIZED : COLOR_UNRECOGNIZED
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
