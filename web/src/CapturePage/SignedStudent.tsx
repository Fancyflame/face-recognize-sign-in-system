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
                width: 200,
                height: 40,
                borderRadius: "2px",
                background: `linear-gradient(30deg, ${bgColor} 20%, transparent 60%)`,
                color: "white",
                lineHeight: "40px",
                paddingLeft: 10,
            }}
        >
            {props.data.getName()}
        </div>
    );
}
