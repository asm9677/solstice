import express from "express";
import upload from "../middlewares/upload.js";
import db from "../config/db.js";
import verifySignature from "../utils/verifySignature.js";
import { sendEvent } from "../utils/scheduler.js";

const router = express.Router();


// 파일 업로드 API (파일 + 주소 함께 받기)
router.post("/upload", upload.single("image"), (req, res) => {
    const { address, signature, hash } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "파일이 없습니다." });
    }

    if (!address || !signature || !hash) {
        return res.status(400).json({ error: "주소, 서명 또는 해시값이 없습니다." });
    }

    // 🛡 서명 검증
    if (!verifySignature(address, signature, hash)) {
        return res.status(403).json({ error: "❌ 서명이 올바르지 않습니다!" });
    }

    // 업로드된 파일 URL 생성
    const filePath = `/uploads/${req.file.filename}`;
    const fileExt = req.file.mimetype.split("/")[1];
    sendEvent({ path: filePath, owner: address, fileExt: fileExt });

    db.run(
        `
            INSERT INTO uploads (address, file_path, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(address) DO UPDATE SET 
            file_path = excluded.file_path,
            created_at = CURRENT_TIMESTAMP
        `,
        [address, filePath],
        function (err) {
            if (err) {
                console.error("❌ DB 저장 실패:", err.message);
                return res.status(500).json({ error: "DB 저장 실패" });
            }

            res.json({
                url: filePath,
                address: address,
                message: "✅ 파일 업로드 및 DB 저장(또는 업데이트) 성공!",
            });
        }
    );
});

router.get("/upload/:address", (req, res) => {
    const address = req.params.address;

    db.get("SELECT * FROM uploads WHERE address = ?", [address], (err, row) => {
        if (err) {
            console.error("❌ 데이터 조회 실패:", err.message);
            return res.status(500).json({ error: "DB 조회 실패" });
        }

        if (!row) {
            return res.status(404).json({ error: "데이터를 찾을 수 없습니다." });
        }

        res.json({
            address: row.address,
            file_url: row.file_path,
            uploaded_at: row.created_at,
        });
    });
});

export default router;