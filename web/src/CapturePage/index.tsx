import * as faceapi from "face-api.js";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import { FrameExtractor } from "./frameExtraction";
import { FaceDetection } from "face-api.js";

export default function CapturePage() {
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
    const [recording, setRecording] = useState(false);
    const [detections, setDetections] = useState<faceapi.FaceDetection[]>([]);
    useCamera(videoEl);

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

        const id = setInterval(task, 500);
        return () => {
            clearInterval(id);
            //setDetections([]);
        };
    }, [recording]);

    const boxes = useMemo(() => {
        if (!videoEl) {
            return [];
        }

        const videoWidth = videoEl.clientWidth;
        const videoHeight = videoEl.clientHeight;
        return detections.map((det) => {
            const { x, y, width, height } = det.relativeBox;
            return (
                <div
                    style={{
                        position: "fixed",
                        left: x * videoWidth,
                        top: y * videoHeight,
                        width: width * videoWidth,
                        height: height * videoHeight,
                        border: "3px solid #54fe9b",
                        borderRadius: 5,
                    }}
                ></div>
            );
        });
    }, [detections]);

    useEffect(() => {
        runFaceApi("./models");
    }, []);

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
            console.log("尝试调用");
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
