import { CSSProperties, JSX } from "react";
import styles from "./iconButton.module.less";

export interface IconButtonProps {
    icon: JSX.Element;
}

export function IconButton(
    props: IconButtonProps & React.HTMLAttributes<HTMLButtonElement>,
) {
    const className = `${styles.iconButton} ${props.className || ""}`;
    const { icon } = props;

    return (
        <button {...props} className={className}>
            {props.icon}
        </button>
    );
}
