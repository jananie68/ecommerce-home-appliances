import { API_BASE_URL } from "../services/api";

export function getImageUrl(src) {
  if (!src) {
    return "https://via.placeholder.com/280x240";
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return `${API_BASE_URL}${src}`;
}
