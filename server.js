import dotenv from "dotenv";
import express from "express";
import https from "https";
import fs from "fs";
import app from "./scripts/app.js";
// import connectDB from "./src/config/db.js";
// import routes from "./src/routes/index.js";
// import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

// SSL 인증서 로드
const options = {
    key: fs.readFileSync("/root/solstice/ssl/private.key"), // 비공개 키 파일
    cert: fs.readFileSync("/root/solstice/ssl/certificate.crt"), // 서버 인증서
    ca: fs.readFileSync("/root/solstice/ssl/ca_bundle.crt"), // 중간 인증서
};

// 데이터베이스 연결
// connectDB();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 주소값 읽기 위해 추가
app.use("/uploads", express.static("public/uploads"));

const PORT = process.env.PORT || 5000;

// HTTPS 서버 실행
https.createServer(options, app).listen(PORT, () => {
    console.log(`🚀 HTTPS Server running on port ${PORT}`);
});

// nohup node server.js > server.log 2>&1 &
// nohup solana-test-validator --limit-ledger-size 50000000 > /dev/null 2>&1 &