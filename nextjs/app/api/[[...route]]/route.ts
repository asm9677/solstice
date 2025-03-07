import { Hono } from "hono";
import { handle } from "hono/vercel";
import images from "./images";
// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/images", images);

export const GET = handle(app);

// 🔹 타입 전용으로 변경
export type AppType = typeof routes;
