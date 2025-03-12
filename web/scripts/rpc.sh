protoc -I=../apis \
    ../apis/remote_signin.proto \
    --js_out=import_style=commonjs:./generated \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:./generated