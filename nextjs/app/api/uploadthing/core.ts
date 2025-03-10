import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("FILE::", file);
      return { url: file.ufsUrl };
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
