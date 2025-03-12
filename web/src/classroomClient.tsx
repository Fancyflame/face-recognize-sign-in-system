import { createContext, JSX, useContext } from "react";
import { ClassroomClient } from "../generated/Remote_signinServiceClientPb";

const ClassroomContext = createContext<ClassroomClient | null>(null);

export function useClassroomClient(): ClassroomClient {
    const client = useContext(ClassroomContext);
    if (client === null) {
        throw "class room not initialized";
    }
    return client;
}

export function ClassroomClientProvider({
    addr,
    children,
}: {
    addr: string;
    children: JSX.Element;
}) {
    const client = new ClassroomClient(addr);

    return (
        <ClassroomContext.Provider value={client}>
            {children}
        </ClassroomContext.Provider>
    );
}
