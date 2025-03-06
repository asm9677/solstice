import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes/index.js";
// import errorHandler from "./src/middlewares/errorHandler";

dotenv.config();

// Express 앱 생성
const app = express();

// 보안 관련 설정 (Helmet)
app.use(helmet());

// CORS 허용
app.use(cors());

// 로그 출력 (개발 환경에서만 실행)
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// JSON 파싱 및 정적 파일 제공
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads")); // 업로드된 파일 제공

// API 라우트 설정
app.use("/api", routes);

// 기본 라우트
app.get("/", (req, res) => {
    res.send("🚀 Express 서버가 정상적으로 실행 중입니다!");
});

// 에러 핸들링 미들웨어
// app.use(errorHandler);

export default app;