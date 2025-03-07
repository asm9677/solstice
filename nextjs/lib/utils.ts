import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { uuid } from "uuidv4";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === "text" && item.type === "textbox";
    }
  });
}

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-string" || type === "textbox";
}

export function dataURLtoBlob(dataURL: string) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export function downloadFile(fileData: Blob, type: string) {
  const blobUrl = URL.createObjectURL(fileData);
  const anchorElement = document.createElement("a");
  anchorElement.href = blobUrl;
  anchorElement.download = `${uuid()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  document.body.removeChild(anchorElement);
  URL.revokeObjectURL(blobUrl);
}

export function downloadJson(json: string) {
  const anchorElement = document.createElement("a");
  anchorElement.href = json;
  anchorElement.download = `${uuid()}.json}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}
