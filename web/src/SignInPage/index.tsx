import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClassroomClient } from "../classroomClient";
import {
    ClassroomSummary,
    GetDetailsReq,
    GetDetailsRes,
    Student,
} from "../../generated/remote_signin_pb";
import styles from "./index.module.less";
import { IconArrowLeft, IconCamera } from "@douyinfe/semi-icons";
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

interface LocalStudent {
    id: string;
    name: string;
    faceDescriptor: Float32Array;
    isSignedIn: boolean;
}

function LoadedPage({
    summary,
    students: studentsArray,
}: {
    summary: ClassroomSummary;
    students: Array<Student>;
}) {
    const [students, setStudents] = useState<Map<string, LocalStudent>>(
        new Map(),
    );

    useEffect(() => {
        setStudents(
            new Map(
                studentsArray.map((stu) => [
                    stu.getId(),
                    {
                        id: stu.getId(),
                        name: stu.getName(),
                        faceDescriptor: new Float32Array(
                            stu.getFaceDescriptorList(),
                        ),
                        isSignedIn: false,
                    },
                ]),
            ),
        );
    }, []);

    const studentDisplay = useMemo(() => {
        return students
            .entries()
            .map(([id, stu]) => {
                const className = [
                    styles.card,
                    stu.isSignedIn ? styles.signedIn : "",
                ].join(" ");

                return (
                    <div className={className} key={id}>
                        {stu.name +
                            " - " +
                            (stu.isSignedIn ? "已签到" : "未签到")}
                    </div>
                );
            })
            .toArray();
    }, [students]);

    return (
        <div className={styles.container}>
            <div className={styles.topHalf}>
                <IconButton icon={<IconArrowLeft />} />
                <div className={styles.infoPart}>
                    <div className={styles.leftHalf}>
                        <h1 className={styles.title}>{summary.getName()}</h1>
                        <div className={styles.summaryTab}>
                            <span>学生人数：{students.size}</span>
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
            </div>
            <div className={styles.bottomHalf}>{studentDisplay}</div>
        </div>
    );
}
