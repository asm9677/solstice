import { Hono } from "hono";
import { handle } from "hono/vercel";
import images from "./images";
import { NextRequest, NextResponse } from "next/server";
// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/images", images);

export const GET = handle(app);

// 🔹 타입 전용으로 변경
export type AppType = typeof routes;

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { imagePath: string } }
// ) {
//   try {
//     console.log("params: ", params);
//     const { imagePath } = params;
//     console.log("imagePath222: ", imagePath);
//     const imageUrl = `/api/images/uploads/${imagePath}`;
//     console.log("Fetching image from: ", imageUrl);

//     // 외부 이미지 서버에서 이미지 데이터 가져오기
//     const response = await fetch(imageUrl);

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to fetch image" },
//         { status: 500 }
//       );
//     }

//     // 이미지 버퍼 변환
//     const buffer = await response.arrayBuffer();
//     return new NextResponse(Buffer.from(buffer), {
//       headers: {
//         "Content-Type": response.headers.get("Content-Type") || "image/png",
//         "Cache-Control": "public, max-age=86400", // 24시간 캐싱
//       },
//     });
//   } catch (error) {
//     console.error("❌ Image API Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
