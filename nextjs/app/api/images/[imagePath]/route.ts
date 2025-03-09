import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { imagePath: string } }
) {
  try {
    const { imagePath } = params;
    const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_API}/uploads/${imagePath}`;

    // 외부 이미지 서버에서 이미지 데이터 가져오기
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }

    // 이미지 버퍼 변환
    const buffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=86400", // 24시간 캐싱
      },
    });
  } catch (error) {
    console.error("❌ Image API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
