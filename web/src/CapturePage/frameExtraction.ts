type Callback = (img: ImageData) => void;

export class FrameExtractor {
    video: HTMLVideoElement;
    callback: Callback;
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _ticker?: number;

    constructor(video: HTMLVideoElement, callback: Callback) {
        this.video = video;
        this._canvas = document.createElement("canvas");
        this.callback = callback;

        const ctx = this._canvas.getContext("2d");
        if(!ctx){
            throw "无法获取canvas上下文";
        }
        // this._canvas.willReadFrequently = true;
        this._ctx = ctx;
    }

    once() {
        const width = this.video.videoWidth;
        const height = this.video.videoHeight;
        this._canvas.width = width;
        this._canvas.height = height;

        this._ctx.drawImage(this.video, 0, 0);
        const imageData = this._ctx.getImageData(0, 0, width, height);
        this.callback(imageData);
    }

    start(interval: number) {
        if (this._ticker) {
            this.stop();
        }
        this._ticker = setInterval(this.once.bind(this), interval);
    }

    stop() {
        clearInterval(this._ticker);
        this._ticker = undefined;
    }
}