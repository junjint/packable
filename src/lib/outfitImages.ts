import type { OutfitTopicId } from "./outfitContent";
import {
  getCuratedOutfitFallbackUrl,
  getCuratedOutfitHeroUrl,
  getCuratedOutfitPhotoUrl,
} from "./curatedPhotos";

export function getOutfitImageQuery(city: string, category: OutfitTopicId): string {
  const place = city.split(",")[0]?.trim() || "city";
  const queries: Record<OutfitTopicId, string> = {
    everyday: `Casual street style for ${place}`,
    shoes: `Travel walking shoes for ${place}`,
    evening: `Evening outfit for ${place}`,
    weather: `Layered weather-ready outfit for ${place}`,
  };
  return queries[category];
}

export function getOutfitImageUrl(city: string, category: OutfitTopicId): string {
  return getCuratedOutfitPhotoUrl(city, category);
}

export function getOutfitHeroImageUrl(city: string, category: OutfitTopicId): string {
  return getCuratedOutfitHeroUrl(city, category);
}

export function getOutfitFallbackImageUrl(category: OutfitTopicId): string {
  return getCuratedOutfitFallbackUrl(category);
}
