import dotenv from "dotenv";
import express from "express";
import app from "./scripts/app.js";
// import connectDB from "./src/config/db.js";
// import routes from "./src/routes/index.js";
// import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

// 데이터베이스 연결
// connectDB();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 주소값 읽기 위해 추가
app.use("/uploads", express.static("public/uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// nohup node server.js > server.log 2>&1 &
// nohup solana-test-validator --limit-ledger-size 50000000 > /dev/null 2>&1 &