import { FaceMatch, FaceMatcher } from "face-api.js";

const CACHED_FACES: FaceMatcher = new FaceMatcher([], 0.5);
const THRESHOLD = 0.5;

export async function tryRecognizeFace(desciptor: Float32Array): Promise<FaceMatch | undefined> {
    const bestMatch = CACHED_FACES.matchDescriptor(desciptor);
    if (bestMatch.distance < THRESHOLD) {
        return bestMatch;
    }
    // TODO: query network
}