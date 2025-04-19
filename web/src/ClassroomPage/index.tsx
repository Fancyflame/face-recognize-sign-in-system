import { IconChevronLeft, IconUserGroup } from "@douyinfe/semi-icons";
import styles from "./index.module.less";
import { useEffect, useMemo, useState } from "react";
import { useClassroomClient } from "../classroomClient";
import {
    ClassroomSummary,
    ListClassroomReq,
} from "../../generated/remote_signin_pb";
import { useNavigate } from "react-router-dom";

export function ClassroomPage() {
    const client = useClassroomClient();
    const [classrooomList, setClassroomList] = useState(
        new Array<ClassroomSummary>(),
    );

    useEffect(() => {
        const fetch = async () => {
            const res = await client.list(new ListClassroomReq());
            const list = res.getOk()?.getClassroomsList();
            if (list) {
                setClassroomList(list);
            }
        };
        fetch();
    }, []);

    const classroomListDisplay = useMemo(() => {
        return classrooomList.map((classroom) => (
            <ClassroomCard classroom={classroom} key={classroom.getId()} />
        ));
    }, [classrooomList]);

    return (
        <div className={styles.container}>
            <div className={styles.insideContainer}>
                <div className={styles.title}>
                    <IconChevronLeft />
                    教室列表
                </div>
                <div className={styles.classroomList}>
                    {classroomListDisplay}
                </div>
            </div>
        </div>
    );
}

interface ClassroomCardProps {
    classroom: ClassroomSummary;
}

function ClassroomCard(props: ClassroomCardProps) {
    const { classroom } = props;
    const navigate = useNavigate();
    const redirect = () => {
        navigate(`/classroom/${classroom.getId()}`);
    };

    return (
        <div className={styles.classroomCard} onClick={redirect}>
            <div className={styles.icon}>
                <IconUserGroup />
            </div>
            <div>{classroom.getName()}</div>
        </div>
    );
}
