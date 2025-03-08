import { execSync } from "child_process";
import * as fs from "fs";

// 获取命令文件路径
const commandFile = process.argv[2];

if (!commandFile) {
    console.error("请提供命令文件，例如：node run.js commands.sh");
    process.exit(1);
}

// 读取命令文件并按行解析
const commands = fs
    .readFileSync(commandFile, "utf-8")
    .replaceAll(/\\\n\w*/g, "")
    .split("\n")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0 && !cmd.startsWith("#")); // 去除空行和注释

try {
    for (const cmd of commands) {
        execSync(cmd, { stdio: "inherit" }); // 继承 stdio，直接输出
    }
} catch {
    process.exit(1);
}
