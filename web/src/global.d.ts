declare module "*.module.less" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.less"; // 让非模块化的 less 也能被识别
