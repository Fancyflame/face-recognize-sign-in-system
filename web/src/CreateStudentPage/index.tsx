import { useEffect, useMemo, useRef, useState } from "react";
import { Student } from "../../generated/remote_signin_pb";
import { LabeledField } from "./LabeledField";
import styles from "./index.module.less";
import { IconButton } from "../components/iconButton";
import {
    IconArrowLeft,
    IconImage,
    IconUpload,
    IconUser,
} from "@douyinfe/semi-icons";
import { useNavigate } from "react-router-dom";
import { useClassroomClient } from "../classroomClient";
import {
    runModel,
    useGetModelLoadState,
    LoadState as ModelLoadState,
} from "../faceApiLocal";

interface StuData {
    id?: string;
    name?: string;
}

export function CreateStudentPage() {
    const [data, setData] = useState<StuData>({});
    const navigate = useNavigate();
    const crClient = useClassroomClient();
    const [file, setFile] = useState<File | null>(null);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const {
        faceDescriptor,
        previewImage,
        state: recState,
    } = useUploadAndRecognizeFace(file);

    const modelLoadState = useGetModelLoadState();

    const callbacks = useMemo(
        () => ({
            quit() {
                navigate("/");
            },
            uploadImgClicked() {
                inputFile.current?.click();
            },
            onUploading() {
                const file = inputFile.current?.files?.[0];
                if (!file) return;
                setFile(file);
            },
            submit() {},
        }),
        [],
    );

    const canSubmit = Boolean(
        faceDescriptor &&
            data.id &&
            data.name &&
            recState === RecognizeState.Done,
    );

    const canUploadImage = Boolean(
        modelLoadState === ModelLoadState.Loaded &&
            recState !== RecognizeState.Uploading &&
            recState !== RecognizeState.Recognizing,
    );

    const uploadImgBtnText = useMemo(() => {
        switch (modelLoadState) {
            case ModelLoadState.Loaded:
                return "选择图像";
            case ModelLoadState.Loading:
                return "模型正在加载";
            case ModelLoadState.Error:
                return "模型加载失败";
        }
    }, [modelLoadState]);

    const makeCallback =
        (field: keyof StuData) => (ev: React.ChangeEvent<HTMLInputElement>) => {
            setData({
                ...data,
                [field]: ev.target.value || undefined,
            });
        };

    return (
        <div className={styles.page}>
            <IconButton icon={<IconArrowLeft />} onClick={callbacks.quit} />
            <h1>创建学生</h1>
            <LabeledField label="人脸图像">
                <input
                    type="file"
                    ref={(self) => {
                        inputFile.current = self;
                    }}
                    accept="image/*"
                    onChange={callbacks.onUploading}
                />
                {previewImage && (
                    <div
                        className={styles.uploadImgView}
                        onClick={callbacks.uploadImgClicked}
                    >
                        <div className={styles.blackShadow}></div>
                        <img src={previewImage} />
                    </div>
                )}
                <UploadHint state={recState} />
                <IconButton
                    className={styles.uploadImgBtn}
                    disabled={!canUploadImage}
                    text={uploadImgBtnText}
                    onClick={callbacks.uploadImgClicked}
                />
            </LabeledField>
            <LabeledField label="学号">
                <input type="text" onChange={makeCallback("id")} />
            </LabeledField>
            <LabeledField label="姓名">
                <input type="text" onChange={makeCallback("name")} />
            </LabeledField>
            <IconButton
                onClick={callbacks.submit}
                className={styles.submit}
                disabled={!canSubmit}
                text="创建"
                icon={<IconUpload />}
            />
        </div>
    );
}

async function readFileToURL(file: File): Promise<string> {
    const fr = new FileReader();
    const readDone = new Promise((resolve, reject) => {
        fr.onload = resolve.bind(undefined);
        fr.onerror = reject;
    });
    fr.readAsArrayBuffer(file);
    await readDone;

    const blob = new Blob([fr.result as ArrayBuffer]);
    return URL.createObjectURL(blob);
}

function useUploadAndRecognizeFace(file: File | null): {
    faceDescriptor: Float32Array | null;
    previewImage: string | null;
    state: RecognizeState;
} {
    const [state, setState] = useState(RecognizeState.None);
    const [preview, setPreview] = useState<string | null>(null);
    const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(
        null,
    );

    const recognize = async () => {
        if (!file) return;
        setState(RecognizeState.Uploading);
        const newUrl = await readFileToURL(file);
        setPreview(newUrl);
        if (preview) URL.revokeObjectURL(preview);

        const image = new Image();
        await new Promise((res, rej) => {
            image.onload = res;
            image.onerror = rej;
            image.src = newUrl;
        });

        setState(RecognizeState.Recognizing);
        const faces = await runModel(image);
        if (faces.length > 1) {
            setState(RecognizeState.TooManyFacesDetected);
            setFaceDescriptor(null);
            return;
        } else if (faces.length < 1) {
            setState(RecognizeState.NoFaceDetected);
            setFaceDescriptor(null);
            return;
        }

        const face = faces[0];
        setState(RecognizeState.Done);
        setFaceDescriptor(face.descriptor);
    };

    useEffect(() => {
        if (
            state === RecognizeState.Uploading ||
            state === RecognizeState.Recognizing
        ) {
            console.error("头像还在上传，此时不允许再上传");
            return;
        }

        recognize().catch((err) => {
            console.error("识别失败：" + err);
            setState(RecognizeState.UnknownError);
            setFaceDescriptor(null);
        });
    }, [file]);

    return {
        faceDescriptor,
        previewImage: preview,
        state,
    };
}

enum RecognizeState {
    None,
    UnknownError,
    Uploading,
    Recognizing,
    NoFaceDetected,
    TooManyFacesDetected,
    Done,
}

function UploadHint({ state }: { state: RecognizeState }) {
    if (state === RecognizeState.None) {
        return undefined;
    }

    const [text, color] = (() => {
        switch (state) {
            case RecognizeState.Uploading:
                return ["正在上传", "var(--color-progress)"];
            case RecognizeState.Recognizing:
                return ["正在识别", "var(--color-progress)"];
            case RecognizeState.UnknownError:
                return ["发生未知错误", "var(--color-error)"];
            case RecognizeState.NoFaceDetected:
                return ["没有检测到人脸", "var(--color-error)"];
            case RecognizeState.TooManyFacesDetected:
                return ["检测到多个人脸", "var(--color-error)"];
            case RecognizeState.Done:
                return ["已识别", "var(--color-ok)"];
        }
    })();

    return (
        <div style={{ color }} className={styles.uploadImgHint}>
            {text}
        </div>
    );
}
