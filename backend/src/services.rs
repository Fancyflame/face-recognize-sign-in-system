use classroom::{
    ClassroomSummary, GetDetailsReq, GetDetailsRes, ListClassroomReq, ListClassroomRes, Student,
    UpdateStudentReq, UpdateStudentRes, classroom_server::Classroom, get_details_res,
    list_classroom_res,
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
        let db = Db::new("sqlite:./test.sqlite").await?;
        Ok(Self { db })
    }
}

impl ClassroomCore {}

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
        _req: Request<ListClassroomReq>,
    ) -> Result<Response<ListClassroomRes>, Status> {
        let classrooms = self
            .db
            .get_all_classrooms()
            .await
            .map_err(anyhow_to_status)?;

        let casted = classrooms
            .into_iter()
            .map(
                |database::Classroom { id, name, students }: database::Classroom| {
                    ClassroomSummary {
                        id,
                        name,
                        student_count: students.len() as _,
                    }
                },
            )
            .collect();

        Ok(Response::new(ListClassroomRes {
            response: Some(list_classroom_res::Response::Ok(list_classroom_res::Data {
                classrooms: casted,
            })),
        }))
    }

    async fn update_student(
        &self,
        req: Request<UpdateStudentReq>,
    ) -> Result<Response<UpdateStudentRes>, Status> {
        let Some(student) = &req.get_ref().student else {
            return Err(Status::invalid_argument("学生信息必须提供"));
        };

        self.db
            .upsert_student(&database::Student {
                id: student.id.clone(),
                name: student.name.clone(),
                face_descriptor: student.face_descriptor.clone(),
            })
            .await
            .map_err(anyhow_to_status)?;

        Ok(Response::new(UpdateStudentRes::default()))
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
