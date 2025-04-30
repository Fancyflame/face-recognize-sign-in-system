import * as faceapi from "face-api.js";
import { createContext, JSX, useContext, useEffect, useState } from "react";

export enum LoadState {
    // Unload,
    Loading,
    Error,
    Loaded,
}

const FaceApiLocalContext = createContext({
    loadState: LoadState.Loading,
});

export function FaceApiLocalProvider({
    children,
    modelPath,
}: {
    children: JSX.Element;
    modelPath: string;
}) {
    const [data, setData] = useState({
        loadState: LoadState.Loading,
    });

    useEffect(() => {
        loadModel(modelPath).then(() => {
            setData({
                ...data,
                loadState: LoadState.Loaded,
            });
        });
    }, [modelPath]);

    return (
        <FaceApiLocalContext.Provider value={data}>
            {children}
        </FaceApiLocalContext.Provider>
    );
}

async function loadModel(pathDir: string) {
    // await faceapi.loadMtcnnModel(pathDir);
    await faceapi.loadSsdMobilenetv1Model(pathDir);
    await faceapi.loadFaceDetectionModel(pathDir);
    await faceapi.loadFaceLandmarkModel(pathDir);
    await faceapi.loadFaceRecognitionModel(pathDir);
    console.log("模型已加载");
}

export function useGetModelLoadState(): LoadState {
    return useContext(FaceApiLocalContext).loadState;
}

export async function runModel(input: faceapi.TNetInput) {
    return await faceapi
        .detectAllFaces(input, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks(false)
        .withFaceDescriptors();
}
