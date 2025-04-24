import { useMemo, useRef, useState } from "react";
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

interface StuData {
    faceDescriptor?: Float32Array;
    id?: string;
    name?: string;
}

export function CreateStudentPage() {
    const [data, setData] = useState<StuData>({});
    const [faceImageBlob, setFaceImageBlob] = useState<string>("");
    const navigate = useNavigate();

    const canUpload = Boolean(data.faceDescriptor && data.id && data.name);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const callbacks = useMemo(
        () => ({
            quit() {
                navigate("/");
            },
            uploadImgClicked() {
                inputFile.current?.click();
            },
            onUploading() {
                if (!inputFile.current) return;
                readFileToURL(inputFile.current).then((newUrl) => {
                    if (!newUrl) return;
                    setFaceImageBlob(newUrl);
                    URL.revokeObjectURL(faceImageBlob);
                });
            },
            submit() {},
        }),
        [],
    );

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
                {faceImageBlob && (
                    <div
                        className={styles.uploadImgView}
                        onClick={callbacks.uploadImgClicked}
                    >
                        <div className={styles.blackShadow}></div>
                        <img src={faceImageBlob} />
                    </div>
                )}
                <IconButton
                    className={styles.uploadImgBtn}
                    text="上传图像"
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
                disabled={!canUpload}
                text="创建"
                icon={<IconUpload />}
            />
        </div>
    );
}

async function readFileToURL(
    fileEl: HTMLInputElement,
): Promise<string | undefined> {
    const file = fileEl.files?.[0];
    if (!file) {
        return;
    }

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
