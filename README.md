# 基于AI模型的教室群体人脸签到系统设计

我在大学电子信息工程专业2025年毕业时毕设。分为前端和后端两部分。

## Requirement

- 需要[安装`protoc`](https://github.com/protocolbuffers/protobuf/release)，并放在`PATH`环境变量中。

## Trouble shooting

### 摄像头访问不了

Chromium插件限制了不安全的跨域访问。在`chrome://flags/`里的`Insecure origins treated as secure`条目给服务器地址放行。

## Usage

在运行前请确保安装了[Requirement](#requirement)章节中所有必要组件。然后先生成gprc绑定，后续运行中无需再重复生成。

### 环境配置和生成grpc绑定

#### 后端

不需要额外操作，但需要`protoc`。最好保持protoc始终可用，否则cargo重新运行build脚本时会出错。

#### 前端

```sh
cd web
npm i pnpm -g # 安装pnpm，已安装可跳过
pnpm i
pnpm rpc
```

### 启动后端

```sh
cd backend
cargo r
```

### 启动前端

```sh
cd web # 已在web目录下就无需执行
pnpm dev
```

