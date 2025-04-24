import { ReactNode } from "react";
import styles from "./LabeledField.module.less";

export interface LabeledFieldProps {
    label: string;
    children?: ReactNode;
}

export function LabeledField(props: LabeledFieldProps) {
    return (
        <div className={styles.labeledField}>
            <div className={styles.label}>{props.label}</div>
            <div className={styles.content}>{props.children}</div>
        </div>
    );
}
