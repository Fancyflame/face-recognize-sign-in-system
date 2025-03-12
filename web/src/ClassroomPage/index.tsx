import { IconChevronLeft } from "@douyinfe/semi-icons";
import styles from "./index.module.less";

export function ClassroomPage() {
    return (
        <div className={styles.container}>
            <div className={styles.insideContainer}>
                <div className={styles.title}>
                    <IconChevronLeft />
                    教室列表
                </div>
            </div>
        </div>
    );
}
