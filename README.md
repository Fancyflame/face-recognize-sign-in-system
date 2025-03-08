# 基于AI模型的教室群体人脸签到系统设计

我在大学电子信息工程专业2025年毕业时毕设。分为前端和后端两部分。

## Requirement

- 需要[安装`protoc`](https://github.com/protocolbuffers/protobuf/release)，并放在`PATH`环境变量中。

## Trouble shooting

### 摄像头访问不了

Chromium插件限制了不安全的跨域访问。在`chrome://flags/`里的`Insecure origins treated as secure`条目给服务器地址放行。