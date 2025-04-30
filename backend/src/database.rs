use anyhow::{Result, anyhow};
use bytemuck::{cast_slice, try_cast_slice};
use serde::{Deserialize, Serialize};
use sqlx::{Row, SqlitePool, prelude::FromRow, sqlite::SqlitePoolOptions};

pub struct Db {
    pool: SqlitePool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Student<FaceDescriptor = Vec<f32>> {
    pub id: String,
    pub name: String,
    pub face_descriptor: FaceDescriptor,
}

#[derive(FromRow)]
pub struct Classroom<Students = Vec<String>> {
    pub id: String,
    pub name: String,
    pub students: Students, // 逗号分隔的学生ID列表
}

impl Db {
    /// 初始化数据库连接并自动创建表（如果不存在）
    pub async fn new(db_path: &str) -> Result<Self> {
        let pool = SqlitePoolOptions::new()
            .max_connections(100)
            .connect(&db_path)
            .await?;

        // 创建 students 表
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                face_descriptor BLOB NOT NULL
            )
            "#,
        )
        .execute(&pool)
        .await?;

        // 创建 classrooms 表
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS classrooms (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                students TEXT NOT NULL
            )
            "#,
        )
        .execute(&pool)
        .await?;

        let this = Db { pool };
        // this.init_test_data().await?;

        Ok(this)
    }

    // 通过学生 ID 查询学生信息
    pub async fn get_student_by_id(&self, student_id: &str) -> Result<Option<Student>> {
        let row = sqlx::query("SELECT id, name, face_descriptor FROM students WHERE id = ?")
            .bind(student_id)
            .fetch_optional(&self.pool)
            .await?;

        let Some(row) = row else {
            return Ok(None);
        };

        let face_desc_bytes: Vec<u8> = row.get("face_descriptor");

        let face_descriptor: Vec<f32> = try_cast_slice(&face_desc_bytes)
            .map_err(anyhow::Error::msg)?
            .to_vec();

        if face_descriptor.len() != 128 {
            return Err(anyhow!(
                "人脸数据长度数据异常：{} bytes",
                face_descriptor.len()
            ));
        }

        Ok(Some(Student {
            id: row.get("id"),
            name: row.get("name"),
            face_descriptor,
        }))
    }

    pub async fn student_exists(&self, student_id: &str) -> Result<bool> {
        let exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM students WHERE id = ?)")
            .bind(student_id)
            .fetch_one(&self.pool)
            .await?;

        Ok(exists)
    }

    pub async fn upsert_student(&self, student: &Student) -> Result<()> {
        let Student {
            id,
            name,
            face_descriptor: face_desc_f32,
        } = student;

        if id.contains(',') {
            return Err(anyhow!("学生id不可包含逗号"));
        }

        let face_descriptor = cast_slice(face_desc_f32);
        let exists = self.student_exists(&id).await?;

        if exists {
            sqlx::query("UPDATE students SET name = ?, face_descriptor = ? WHERE id = ?")
                .bind(name)
                .bind(face_descriptor)
                .bind(id)
                .execute(&self.pool)
                .await?;
        } else {
            sqlx::query("INSERT INTO students (id, name, face_descriptor) VALUES (?, ?, ?)")
                .bind(id)
                .bind(name)
                .bind(face_descriptor)
                .execute(&self.pool)
                .await?;
        }

        Ok(())
    }

    #[allow(dead_code)]
    pub async fn insert_classroom(
        &self,
        Classroom { id, name, students }: &Classroom,
    ) -> Result<()> {
        let students_string = students.join(",");

        sqlx::query("INSERT INTO classrooms (id, name, students) VALUES (?, ?, ?)")
            .bind(id)
            .bind(name)
            .bind(students_string)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn get_classroom_by_id(&self, id: &str) -> Result<Option<Classroom>> {
        let row: Option<Classroom<String>> =
            sqlx::query_as("SELECT id, name, students FROM classrooms WHERE id = ?")
                .bind(id)
                .fetch_optional(&self.pool)
                .await?;

        let Some(row) = row else { return Ok(None) };
        let Classroom { id, name, students } = row;

        Ok(Some(Classroom {
            id,
            name,
            students: parse_students(&students),
        }))
    }

    pub async fn get_all_classrooms(&self) -> Result<Vec<Classroom>> {
        let vec: Vec<Classroom<String>> =
            sqlx::query_as("SELECT id, name, students FROM classrooms")
                .fetch_all(&self.pool)
                .await?;

        Ok(vec
            .into_iter()
            .map(|classroom| Classroom {
                id: classroom.id,
                name: classroom.name,
                students: parse_students(&classroom.students),
            })
            .collect())
    }
}

fn parse_students(s: &str) -> Vec<String> {
    s.split(",").map(str::to_string).collect()
}
