import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-string" || type === "textbox";
}

export const rgbaToHex = (rgba: string): string => {
  // 정규식을 사용하여 RGBA 값 추출
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);

  if (!match) {
    throw new Error("Invalid RGBA format");
  }

  let [, r, g, b, a] = match.map(Number);

  // 알파 값이 없을 경우 기본값 1 설정
  if (isNaN(a)) a = 1;

  // RGB를 16진수로 변환
  const toHex = (num: number) => num.toString(16).padStart(2, "0");

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  // 알파 값이 1보다 작을 경우 알파값까지 포함한 8자리 HEX 반환
  return a < 1 ? `${hex}${toHex(Math.round(a * 255))}` : hex;
};
