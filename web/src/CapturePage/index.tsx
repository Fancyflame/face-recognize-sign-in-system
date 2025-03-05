import * as faceapi from "face-api.js";
import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
// import { FrameExtractor } from "./frameExtraction";
import { FaceDetection } from "face-api.js";

export default function CapturePage() {
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
    const [recording, setRecording] = useState(false);
    const [detections, setDetections] = useState<faceapi.FaceDetection[]>([]);

    if (!recording && detections.length) {
        setDetections([]);
    }

    useCamera(videoEl);
    useEffect(() => {
        runFaceApi("./models");
    }, []);

    useEffect(() => {
        if (!recording) {
            return;
        }

        const task = async () => {
            const detections = await faceapi.detectAllFaces(
                videoEl!,
                new faceapi.SsdMobilenetv1Options()
            );

            setDetections(detections);
            console.log(detections);
        };

        const id = setInterval(task, 100);
        return () => {
            clearInterval(id);
            setDetections([]);
        };
    }, [recording]);

    const boxes = useMemo(() => {
        return videoEl ? faceDetectionsToDivs(videoEl, detections) : [];
    }, [detections]);

    return (
        <div className={styles.container}>
            <video className={styles.camera} ref={setVideoEl}></video>
            <div>{boxes}</div>
            <div className={styles.overlay}>
                <div className={styles.students}></div>
                <button
                    onClick={() => setRecording(!recording)}
                    className={`${styles.startBtn} ${
                        recording ? styles.recording : ""
                    }`}
                ></button>
            </div>
        </div>
    );
}

async function useCamera(videoRef: HTMLVideoElement | null) {
    const openCam = async (video: HTMLVideoElement) => {
        const constraints: MediaStreamConstraints = {
            video: {
                facingMode: { ideal: "environment" }, // 使用后置摄像头
                width: 1280, // width和height在手机端要反过来 (???)
                height: 720,
            },
            audio: false,
        };

        let stream: MediaStream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
            alert(error);
            throw "获取摄像头失败:" + error;
        }
        video.srcObject = stream;
        video.play();
    };

    const closeCam = (video: HTMLVideoElement) => {
        // 组件卸载时关闭摄像头
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
    };

    useEffect(() => {
        if (videoRef) {
            console.log("尝试调用摄像头");
            openCam(videoRef);
            return closeCam.bind(null, videoRef);
        }
    }, [videoRef]);
}

async function runFaceApi(pathDir: string) {
    // await faceapi.loadMtcnnModel(pathDir);
    await faceapi.loadSsdMobilenetv1Model(pathDir);
    await faceapi.loadFaceDetectionModel(pathDir);
    console.log("模型已加载");
}

function faceDetectionsToDivs(
    video: HTMLVideoElement,
    detections: FaceDetection[]
) {
    const videoBox = getVideoDisplayRect(video);

    return detections.map((det) => {
        const { x, y, width, height } = det.relativeBox;
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
