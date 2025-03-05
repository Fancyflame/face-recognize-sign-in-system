import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import {
    DetectionResults,
    faceDetectionsToDivs,
    loadModel,
    runModel,
} from "./faceRecognition";

export default function CapturePage() {
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
    const [recording, setRecording] = useState(false);
    const [detections, setDetections] = useState<DetectionResults>([]);

    if (!recording && detections.length) {
        setDetections([]);
    }

    useCamera(videoEl);
    useEffect(() => {
        loadModel("./models");
    }, []);

    useEffect(() => {
        if (!recording) {
            return;
        }

        const task = async () => {
            const detections = await runModel(videoEl!);
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
