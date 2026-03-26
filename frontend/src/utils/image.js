import { getAssetUrl } from "../lib/api";

export function getImageUrl(src) {
  if (!src) {
    return "https://via.placeholder.com/280x240";
  }

  return getAssetUrl(src);
}
