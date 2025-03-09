// const getCanvasHash = async (blob: Blob): Promise<string> =>  {  
//     const arrayBuffer = await blob.arrayBuffer();
//     const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
//     const hashHex = Buffer.from(hashBuffer).toString("hex");

//     return hashHex;
// };

// // 사용 예제
// const handleHash = async () => {
//   const canvas = document.querySelector("canvas"); // Canvas 가져오기
//   if (!canvas) return;

//   const hash = await getCanvasHash(canvas);
//   console.log("Canvas SHA-256 Hash:", hash);
// };
