import multer from "multer";
import path from "path";

// 저장 폴더 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/"); // 파일이 저장될 폴더
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 파일명 설정 (중복 방지)
    },
});

// 파일 필터링 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    }
    cb(new Error("❌ 지원되지 않는 파일 형식입니다. (JPEG, PNG, GIF만 허용)"));
};

// 파일 업로드 설정 (최대 크기: 5MB)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    fileFilter,
});

export default upload;