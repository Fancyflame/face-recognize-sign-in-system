import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClassroomClient } from "../classroomClient";
import {
    ClassroomSummary,
    GetDetailsReq,
    GetDetailsRes,
    Student,
} from "../../generated/remote_signin_pb";
import { StatusCode } from "grpc-web";
import styles from "./index.module.less";
import {
    IconArrowLeft,
    IconCamera,
    IconPlay,
    IconVideo,
} from "@douyinfe/semi-icons";
import { IconButton } from "../components/iconButton";

type Data =
    | {
          status: "loading" | "error";
      }
    | {
          status: "ok";
          data: GetDetailsRes.Data;
      };

export function SignInPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<Data>({
        status: "loading",
    });

    if (!roomId) {
        navigate("/");
        return <></>;
    }

    const client = useClassroomClient();
    useEffect(() => {
        const detailsReq = new GetDetailsReq();
        detailsReq.setClassroomId(roomId);
        client.getDetails(new GetDetailsReq(), null, (err, res) => {
            if (err) {
                setData({ status: "error" });
            }

            const data = res.getOk();
            if (data) {
                setData({
                    status: "ok",
                    data,
                });
            } else {
                setData({ status: "error" });
            }
        });
    }, [roomId]);

    switch (data.status) {
        case "ok":
            const summary = data.data.getInfo();
            const students = data.data.getStudentsList();

            return summary ? (
                <LoadedPage summary={summary} students={students} />
            ) : (
                <div>无法获取教室信息</div>
            );
        case "error":
            return <div>Oops，加载出错了</div>;
        case "loading":
            return <div>正在加载教室中...</div>;
    }
}

function LoadedPage({
    summary,
    students,
}: {
    summary: ClassroomSummary;
    students: Array<Student>;
}) {
    return (
        <div className={styles.container}>
            <div className={styles.infoPart}>
                <div className={styles.leftHalf}>
                    <IconButton icon={<IconArrowLeft />} />
                    <h1 className={styles.title}>{summary.getName()}</h1>
                    <div className={styles.summaryTab}>
                        <span>学生人数：{students.length}</span>
                        <span>教室ID：{summary.getId()}</span>
                    </div>
                </div>
                <div className={styles.rightHalf}>
                    <IconButton
                        icon={<IconCamera />}
                        className={styles.recordBtn}
                    />
                </div>
            </div>
            <div className={styles.stuPart}></div>
        </div>
    );
}
