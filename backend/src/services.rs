use classroom::{
    ClassroomSummary, GetDetailsReq, GetDetailsRes, ListClassroomReq, ListClassroomRes, Student,
    classroom_server::Classroom, get_details_res, list_classroom_res,
};
use tonic::{Request, Response, Status};

use crate::database::{self, Db};

pub mod classroom {
    tonic::include_proto!("remote_signin");
}

pub struct ClassroomCore {
    db: Db,
}

impl ClassroomCore {
    pub async fn new() -> anyhow::Result<Self> {
        let db = Db::new("sqlite:./test.db").await?;
        Ok(Self { db })
    }
}

#[tonic::async_trait]
impl Classroom for ClassroomCore {
    async fn get_details(
        &self,
        req: Request<GetDetailsReq>,
    ) -> Result<Response<GetDetailsRes>, Status> {
        dbg!(&req);

        let classroom_id = &*req.get_ref().classroom_id;
        let classroom = self
            .db
            .get_classroom_by_id(&classroom_id)
            .await
            .map_err(anyhow_to_status)?;

        let Some(classroom) = classroom else {
            return Err(Status::not_found(format!(
                "id为`{classroom_id}`的教室不存在"
            )));
        };

        let mut students_details = Vec::new();
        for id in &classroom.students {
            let stu = self
                .db
                .get_student_by_id(&id)
                .await
                .map_err(anyhow_to_status)?;

            if let Some(stu) = stu {
                students_details.push(cast_db_stu_to_rpc_stu(stu));
            }
        }

        let response = Response::new(GetDetailsRes {
            response: Some(get_details_res::Response::Ok(get_details_res::Data {
                info: Some(ClassroomSummary {
                    id: classroom.id,
                    name: classroom.name,
                    student_count: classroom.students.len() as u32,
                }),
                students: students_details,
            })),
        });

        Ok(response)
    }

    async fn list(
        &self,
        req: Request<ListClassroomReq>,
    ) -> Result<Response<ListClassroomRes>, Status> {
        Ok(Response::new(ListClassroomRes {
            response: Some(list_classroom_res::Response::Ok(list_classroom_res::Data {
                classrooms: vec![ClassroomSummary {
                    id: "test".into(),
                    name: "测试教室".into(),
                    student_count: 1,
                }],
            })),
        }))
    }
}

fn anyhow_to_status(err: anyhow::Error) -> Status {
    Status::unknown(err.to_string())
}

fn cast_db_stu_to_rpc_stu(
    database::Student {
        id,
        name,
        face_descriptor,
    }: database::Student,
) -> Student {
    Student {
        id,
        name,
        face_descriptor,
    }
}
