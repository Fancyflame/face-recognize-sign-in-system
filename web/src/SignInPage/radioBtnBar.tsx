import { useMemo, useState } from "react";
import styles from "./radioBtnBar.module.less";

export interface RadioBtnBarProps {
    options: Array<RadioButtonInfo>;
    onSelect?: (value: string) => void;
    className: string | undefined;
}

export interface RadioButtonInfo {
    displayText: string;
    value: string;
}

export function RadioBtnBar(props: RadioBtnBarProps) {
    const className = useMemo(
        () => [styles.bar, props.className || ""].join(" "),
        [props.className],
    );

    const [selected, setSelected] = useState(props.options[0]?.value || "");
    const onSelect = (value: string) => {
        setSelected(value);
        if (props.onSelect) {
            props.onSelect(value);
        }
    };

    return (
        <form className={className}>
            {props.options.map((opt: RadioButtonInfo) => (
                <RadioButton
                    {...opt}
                    selected={selected}
                    onSelect={onSelect}
                    key={opt.value}
                />
            ))}
        </form>
    );
}

interface RadioButtonProps extends RadioButtonInfo {
    selected: string;
    onSelect: (value: string) => void;
}

function RadioButton(props: RadioButtonProps) {
    const thisSelected = props.selected == props.value;
    const className = useMemo(
        () => [styles.btn, thisSelected ? styles.selected : ""].join(" "),
        [props.selected, thisSelected],
    );

    return (
        <div className={className} onClick={() => props.onSelect(props.value)}>
            {props.displayText}
        </div>
    );
}
