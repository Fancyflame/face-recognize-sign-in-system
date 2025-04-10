use std::time::Duration;

use anyhow::{Result, anyhow};
use services::{ClassroomCore, classroom::classroom_server::ClassroomServer};
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{AllowHeaders, AllowMethods, AllowOrigin};

mod database;
mod services;

#[tokio::main]
async fn main() -> Result<()> {
    let addr = "0.0.0.0:10000".parse().unwrap();
    let server = ClassroomServer::new(
        ClassroomCore::new()
            .await
            .map_err(|e| anyhow!("无法连接到数据库：{e}"))?,
    );

    let cors_layer = tower_http::cors::CorsLayer::new()
        .allow_origin(AllowOrigin::any())
        .allow_methods(AllowMethods::any())
        .allow_headers(AllowHeaders::any())
        .max_age(Duration::from_secs(3600));

    Server::builder()
        .layer(cors_layer)
        .layer(GrpcWebLayer::new())
        .accept_http1(true)
        .add_service(server)
        .serve(addr)
        .await?;

    Ok(())
}
