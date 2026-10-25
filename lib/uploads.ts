import "server-only";
import path from "path";

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export function uploadDir() {
  return path.resolve(process.env.UPLOAD_DIR ?? "./uploads");
}
