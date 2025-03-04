import * as faceapi from "face-api.js";
import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import { FrameExtractor } from "./frameExtraction";

export default function CapturePage() {
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
    const [recording, setRecording] = useState(false);
    useCamera(videoEl);

    const frameExtractor = useMemo(() => {
        if (!videoEl) {
            return;
        }
        return new FrameExtractor(videoEl, (img) => {
            console.log(img);
        });
    }, [videoEl]);

    useEffect(() => {
        runFaceApi("./models");
    }, []);

    return (
        <div className={styles.container}>
            <video
                className={styles.camera}
                ref={setVideoEl}
                onCanPlay={() => frameExtractor?.start(1000)}
            ></video>
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
    await faceapi.loadMtcnnModel(pathDir);
    await faceapi.loadFaceDetectionModel(pathDir);
    console.log("模型已加载");
}
