use anyhow::{Result, anyhow};
use bytemuck::{cast_slice, try_cast_slice};
use serde::{Deserialize, Serialize};
use sqlx::{Row, SqlitePool, sqlite::SqlitePoolOptions};

pub struct Db {
    pool: SqlitePool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Student {
    pub id: String,
    pub name: String,
    pub face_descriptor: Vec<f32>,
}

impl Db {
    /// 初始化数据库连接并自动创建表（如果不存在）
    pub async fn new(db_path: &str) -> Result<Self> {
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
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
        this.upsert_student(&test_data()).await?;

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
}

fn test_data() -> Student {
    Student {
        id: "me.id".into(),
        name: "另外的名字".into(),
        face_descriptor: [
            -0.08971253782510757,
            0.03718134015798569,
            0.09630341827869415,
            -0.018268045037984848,
            -0.01877114176750183,
            -0.07721316814422607,
            -0.030647853389382362,
            -0.15090614557266235,
            0.1282045990228653,
            -0.07793144881725311,
            0.28414103388786316,
            -0.07963322103023529,
            -0.2506314814090729,
            -0.14180146157741547,
            -0.0022994489409029484,
            0.13085578382015228,
            -0.12002620846033096,
            -0.09027782082557678,
            -0.06598039716482162,
            0.023502949625253677,
            0.06678393483161926,
            0.0012679838109761477,
            0.051380399614572525,
            -0.031983163207769394,
            -0.1252363622188568,
            -0.33846551179885864,
            -0.09234794229269028,
            -0.051908303052186966,
            -0.047781117260456085,
            -0.048095449805259705,
            -0.04800296202301979,
            0.03951236978173256,
            -0.17813967168331146,
            -0.05058925226330757,
            -0.002390149049460888,
            0.07392492145299911,
            -0.02873285673558712,
            -0.06187325343489647,
            0.16354882717132568,
            -0.044839173555374146,
            -0.25203728675842285,
            -0.05187826603651047,
            0.03795234486460686,
            0.1996397078037262,
            0.15387007594108582,
            0.040265750139951706,
            -0.017670417204499245,
            -0.15035578608512878,
            0.0819297581911087,
            -0.18542730808258057,
            0.07205099612474442,
            0.1428283154964447,
            0.045804351568222046,
            0.04024655371904373,
            0.02070435881614685,
            -0.041450973600149155,
            0.002814287319779396,
            0.13265788555145264,
            -0.11647859960794449,
            -0.02285057306289673,
            0.13067199289798737,
            -0.05347353219985962,
            -0.12084150314331055,
            -0.12841059267520905,
            0.20661944150924683,
            0.09030088782310486,
            -0.1660289317369461,
            -0.10963413119316101,
            0.06991047412157059,
            -0.11533762514591217,
            -0.12936262786388397,
            0.040478188544511795,
            -0.14191707968711853,
            -0.2139468938112259,
            -0.3448549807071686,
            0.03689165040850639,
            0.3484751880168915,
            0.05272985249757767,
            -0.22733289003372192,
            0.029079942032694817,
            -0.050486888736486435,
            0.042544372379779816,
            0.17949813604354858,
            0.1365373283624649,
            0.005502546206116676,
            0.06704452633857727,
            -0.06932934373617172,
            -0.020027264952659607,
            0.19357429444789886,
            -0.080478735268116,
            -0.02148713544011116,
            0.22943970561027527,
            -0.02888064831495285,
            0.07184278964996338,
            0.005765441805124283,
            0.030568094924092293,
            0.022344037890434265,
            0.03953740373253822,
            -0.1488022655248642,
            0.01607000268995762,
            0.1681300550699234,
            0.001788213849067688,
            -0.004169034771621227,
            0.09800007939338684,
            -0.1503029763698578,
            0.11867765337228775,
            0.07666989415884018,
            0.06097791716456413,
            0.19230963289737701,
            -0.07257174700498581,
            -0.08534901589155197,
            -0.12408091127872467,
            0.10039369761943817,
            -0.2514575123786926,
            0.1644335836172104,
            0.1319848895072937,
            0.05251210182905197,
            0.09516126662492752,
            0.11594144999980927,
            0.11351734399795532,
            -0.010948237031698227,
            0.007451093755662441,
            -0.2280501425266266,
            -0.004557623993605375,
            0.1360064595937729,
            0.019660381600260735,
            0.0469808503985405,
            -0.018588203936815262,
        ]
        .to_vec(),
    }
}
