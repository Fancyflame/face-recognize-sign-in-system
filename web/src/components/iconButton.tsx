import { JSX } from "react";
import styles from "./iconButton.module.less";

export interface IconButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    text?: string;
}

export function IconButton(props: IconButtonProps) {
    const className = `${styles.iconButton} ${props.className || ""}`;
    const htmlAttrs = {
        ...props,
        icon: undefined,
        text: undefined,
    };

    return (
        <button {...htmlAttrs} className={className}>
            {props.icon}
            {props.text ? <span>{props.text}</span> : null}
        </button>
    );
}
