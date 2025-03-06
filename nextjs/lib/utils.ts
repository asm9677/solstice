import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-string" || type === "textbox";
}
