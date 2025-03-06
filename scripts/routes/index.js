import express from "express";
import imageRoutes from "./imageRoutes.js";

const router = express.Router();

router.use("/image", imageRoutes);

export default router;