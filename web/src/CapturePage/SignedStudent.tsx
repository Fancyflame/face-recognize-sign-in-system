import { Student } from "../../generated/remote_signin_pb";

export interface SignedStudentProps {
    data: Student;
    signinMode: "normal" | "external";
}

export default function SignedStudent(props: SignedStudentProps) {
    const bgColor = props.signinMode === "external" ? "dodgerblue" : "#2ecc71";

    return (
        <div
            style={{
                width: 190,
                height: 40,
                borderRadius: "2px",
                background: `linear-gradient(20deg, ${bgColor} 10%, transparent 70%)`,
                color: "white",
                lineHeight: "40px",
                paddingLeft: 10,
            }}
        >
            {props.data.getName()}
        </div>
    );
}
