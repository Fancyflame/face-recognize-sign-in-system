import * as faceapi from "face-api.js";

export type DetectionResults = Awaited<ReturnType<typeof runModel>>;

export async function loadModel(pathDir: string) {
    // await faceapi.loadMtcnnModel(pathDir);
    await faceapi.loadSsdMobilenetv1Model(pathDir);
    await faceapi.loadFaceDetectionModel(pathDir);
    console.log("模型已加载");
}

export async function runModel(video: HTMLVideoElement) {
    return await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();
}

export function faceDetectionsToDivs(
    video: HTMLVideoElement,
    detections: DetectionResults,
) {
    const videoBox = getVideoDisplayRect(video);

    return detections.map((det) => {
        const { x, y, width, height } = det.alignedRect.relativeBox;
        return (
            <div
                style={{
                    position: "fixed",
                    left: video.clientLeft + videoBox.x + x * videoBox.width,
                    top: video.clientTop + videoBox.y + y * videoBox.height,
                    width: width * videoBox.width,
                    height: height * videoBox.height,
                    border: "3px solid #54fe9b",
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
