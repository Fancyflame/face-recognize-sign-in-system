import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import {
    DetectionResult,
    FaceDetectionsBox,
    useMatchFace,
} from "./faceRecognition";
import {
    runModel,
    useGetModelLoadState,
    LoadState as ModelLoadState,
} from "../faceApiLocal";
import { Student } from "../../generated/remote_signin_pb";
import SignedStudent from "./SignedStudent";
import { IconArrowLeft } from "@douyinfe/semi-icons";
import { IconButton } from "../components/iconButton";
import { LocalStudent } from "../SignInPage";

export interface StudentsInfoProps {
    students: Map<string, LocalStudent>;
    signedInList: Set<string>;
    setSignedInList: (list: Set<string>) => void;
    quit: () => void;
}

export default function CapturePage(props: StudentsInfoProps) {
    const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
    const [recording, setRecording] = useState(false);
    const [detections, setDetections] = useState<DetectionResult[]>([]);

    if (!recording && detections.length) {
        setDetections([]);
    }

    useEffect(() => {
        document.documentElement.requestFullscreen();
        return () => {
            document.exitFullscreen();
        };
    }, []);

    useCamera(videoEl);
    const modelLoadState = useGetModelLoadState();

    const { markedDetections } = useMatchFace(detections, props);

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

    const signedInStudentsDisplay = useMemo(() => {
        return props.signedInList
            .values()
            .map((stuId) => {
                return (
                    <SignedStudent
                        key={stuId}
                        data={props.students.get(stuId)!}
                        signinMode="normal"
                    />
                );
            })
            .toArray();
    }, [props.signedInList]);

    const boxes = useMemo(() => {
        return videoEl ? (
            <FaceDetectionsBox video={videoEl} detections={markedDetections} />
        ) : null;
    }, [detections]);

    const recordButtonClass = useMemo(() => {
        if (recording) {
            return styles.recording;
        } else if (modelLoadState === ModelLoadState.Loading) {
            return styles.inLoading;
        } else {
            return "";
        }
    }, [recording, modelLoadState]);

    return (
        <div className={styles.container}>
            <video className={styles.camera} ref={setVideoEl}></video>
            <div>{boxes}</div>
            <div className={styles.overlay}>
                <div className={styles.leftHalf}>
                    <IconButton
                        icon={<IconArrowLeft />}
                        className={styles.backBtn}
                        onClick={props.quit}
                    />
                    <div className={styles.students}>
                        {signedInStudentsDisplay}
                    </div>
                </div>

                <button
                    disabled={modelLoadState !== ModelLoadState.Loaded}
                    onClick={() => setRecording(!recording)}
                    className={`${styles.startBtn} ${recordButtonClass}`}
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
