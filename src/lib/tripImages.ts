import { CITY_HERO_FALLBACK, getCuratedCityHeroUrl } from "./curatedPhotos";

const cityGradients: Record<string, string> = {
  barcelona: "linear-gradient(135deg, #c4dce8 0%, #8fb4c4 45%, #4a6a72 100%)",
  paris: "linear-gradient(135deg, #d8dce6 0%, #9aa8bc 50%, #4a5568 100%)",
  "new york": "linear-gradient(135deg, #c8d4e4 0%, #7a8fa8 50%, #3d4f63 100%)",
  tokyo: "linear-gradient(135deg, #e2e8ec 0%, #a8b8c4 50%, #5a6a78 100%)",
  seoul: "linear-gradient(135deg, #d4e4ec 0%, #8aacbc 50%, #4a6878 100%)",
  london: "linear-gradient(135deg, #c6ccd4 0%, #8898a8 50%, #45505c 100%)",
  rome: "linear-gradient(135deg, #e4dcc8 0%, #b8a888 50%, #6a5e48 100%)",
  amsterdam: "linear-gradient(135deg, #c8dce8 0%, #88b0c0 50%, #4a6878 100%)",
  singapore: "linear-gradient(135deg, #d0e8e4 0%, #88b8a8 50%, #4a6860 100%)",
  lisbon: "linear-gradient(135deg, #e8dcc4 0%, #c4a878 50%, #786840 100%)",
  berlin: "linear-gradient(135deg, #d0d4d8 0%, #98a0a8 50%, #505860 100%)",
  default: "linear-gradient(135deg, #d4e8ec 0%, #9ec4d0 45%, #5a7880 100%)",
};

const outfitGradients: Record<string, string> = {
  layers: "linear-gradient(160deg, #e8eef0 0%, #b8ccd4 100%)",
  shoes: "linear-gradient(160deg, #ece8e4 0%, #c4b8ac 100%)",
  fabrics: "linear-gradient(160deg, #eef4f0 0%, #b8d4c8 100%)",
  evening: "linear-gradient(160deg, #e4e0ec 0%, #a8a0b8 100%)",
  rain: "linear-gradient(160deg, #dce4ec 0%, #98b0c4 100%)",
};

export function cityKey(destination: string): string {
  const base = destination.split(",")[0]?.trim().toLowerCase() || "";
  return base || "default";
}

export function getCityHeroGradient(destination: string): string {
  const key = cityKey(destination);
  return cityGradients[key] ?? cityGradients.default;
}

export function getOutfitGradient(kind: keyof typeof outfitGradients | string): string {
  return outfitGradients[kind] ?? outfitGradients.layers;
}

export function getCityPhotoUrl(destination: string): string {
  return getCuratedCityHeroUrl(destination);
}

export function getCityPhotoFallbackUrl(): string {
  return CITY_HERO_FALLBACK;
}
