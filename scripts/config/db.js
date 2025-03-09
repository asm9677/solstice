import sqlite3 from "sqlite3";

sqlite3.verbose();

// SQLite3 데이터베이스 연결 (파일 기반 DB)
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("❌ SQLite 연결 실패:", err.message);
  } else {
    console.log("✅ SQLite 연결 성공");
  }
});

// 테이블 생성 (address, file_path 저장)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT UNIQUE NOT NULL,
      file_path TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;