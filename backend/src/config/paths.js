import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getUploadDirectory() {
  return process.env.UPLOAD_DIR || path.resolve(__dirname, "../../uploads");
}
