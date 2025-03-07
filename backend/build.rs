use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    tonic_build::configure()
        .build_server(true)
        .build_client(false)
        .compile_protos(&["../apis/remote_signin.proto"], &["../apis/"])?;
    Ok(())
}
