import type { OutfitTopicId } from "./outfitContent";
import { picsumIdUrl, unsplashPhotoUrl } from "./remoteImages";

/**
 * Verified Unsplash photo IDs (HEAD-checked). Grouped by meaning, not random seeds.
 * @see https://unsplash.com — IDs are stable CDN paths on images.unsplash.com
 */

// —— City / travel heroes ——
const U = {
  paris: "photo-1502602898657-3e91760cbb34",
  nyc: "photo-1496442226666-8d4d0e62e6e9",
  rome: "photo-1552832230-c0197dd311b5",
  tokyo: "photo-1542051841857-5f90071e7989",
  istanbul: "photo-1524231757912-21f4fe3a7200",
  la: "photo-1473496169904-658ba7c44d8a",
  sf: "photo-1501594907352-04cda38ebc29",
  miami: "photo-1570168007204-dfb528c6958f",
  beach: "photo-1507525428034-b723cf961d3e",
  europe: "photo-1467269204594-9661b134dd2b",
  asiaNight: "photo-1514565131-fce0801e5785",
  travelRoad: "photo-1469854523086-cc02fe5d8800",
  travelPlane: "photo-1488085061387-422e29b40080",
  mountains: "photo-1523906834658-6e24ef2386f9",
} as const;

/** Wikimedia Commons — landmark shots where Unsplash IDs 404. */
const W = {
  paris:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/1280px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
  london:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/London_Montage_L.jpg/1280px-London_Montage_L.jpg",
  tokyo:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg",
  sydney:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sydney_Opera_House_Sails.jpg/1280px-Sydney_Opera_House_Sails.jpg",
} as const;

type Region = "europe" | "asia" | "americas" | "beach" | "oceania" | "default";

const REGION_HERO: Record<Region, string> = {
  europe: unsplashPhotoUrl(U.europe, 900, 560),
  asia: unsplashPhotoUrl(U.tokyo, 900, 560),
  americas: unsplashPhotoUrl(U.nyc, 900, 560),
  beach: unsplashPhotoUrl(U.beach, 900, 560),
  oceania: W.sydney,
  default: unsplashPhotoUrl(U.travelRoad, 900, 560),
};

/** City key (first segment of destination, lowercased) → hero image URL. */
const CITY_HERO_URLS: Record<string, string> = {
  barcelona: unsplashPhotoUrl(U.europe, 900, 560),
  paris: unsplashPhotoUrl(U.paris, 900, 560),
  "new york": unsplashPhotoUrl(U.nyc, 900, 560),
  tokyo: W.tokyo,
  seoul: unsplashPhotoUrl(U.asiaNight, 900, 560),
  london: W.london,
  "mexico city": unsplashPhotoUrl(U.travelRoad, 900, 560),
  rome: unsplashPhotoUrl(U.rome, 900, 560),
  amsterdam: unsplashPhotoUrl(U.europe, 900, 560),
  singapore: unsplashPhotoUrl(U.asiaNight, 900, 560),
  "los angeles": unsplashPhotoUrl(U.la, 900, 560),
  seattle: unsplashPhotoUrl(U.sf, 900, 560),
  madrid: unsplashPhotoUrl(U.europe, 900, 560),
  berlin: unsplashPhotoUrl(U.europe, 900, 560),
  copenhagen: unsplashPhotoUrl(U.europe, 900, 560),
  lisbon: unsplashPhotoUrl(U.europe, 900, 560),
  miami: unsplashPhotoUrl(U.miami, 900, 560),
  cancun: unsplashPhotoUrl(U.beach, 900, 560),
  sydney: W.sydney,
};

const CITY_REGION: Record<string, Region> = {
  barcelona: "europe",
  paris: "europe",
  london: "europe",
  rome: "europe",
  amsterdam: "europe",
  madrid: "europe",
  berlin: "europe",
  copenhagen: "europe",
  lisbon: "europe",
  tokyo: "asia",
  seoul: "asia",
  singapore: "asia",
  "new york": "americas",
  "los angeles": "americas",
  seattle: "americas",
  "mexico city": "americas",
  miami: "beach",
  cancun: "beach",
  sydney: "oceania",
};

// —— Outfit / packing inspiration (topic = subject matter) ——
const OUTFIT_TOPIC_IDS: Record<OutfitTopicId, string> = {
  everyday: "photo-1490481651871-ab68de25d43d",
  shoes: "photo-1542291026-7eec264c27ff",
  evening: "photo-1594938298603-c8148c4dae35",
  weather: "photo-1551028719-00167b16eac5",
};

const OUTFIT_TOPIC_FALLBACK_IDS: Record<OutfitTopicId, string> = {
  everyday: "photo-1523381210434-271e8be1f52b",
  shoes: "photo-1542291026-7eec264c27ff",
  evening: "photo-1524504388940-b1c1722653e1",
  weather: "photo-1434389677669-e08b4cac3105",
};

export const CITY_HERO_FALLBACK = unsplashPhotoUrl(U.travelRoad, 900, 560);
export const CITY_HERO_LAST_RESORT = picsumIdUrl(1015, 900, 560);

export function cityKeyFromDestination(destination: string): string {
  return destination.split(",")[0]?.trim().toLowerCase() || "default";
}

export function getCuratedCityHeroUrl(destination: string): string {
  const key = cityKeyFromDestination(destination);
  if (CITY_HERO_URLS[key]) return CITY_HERO_URLS[key];
  const region = CITY_REGION[key] ?? "default";
  return REGION_HERO[region];
}

export function getCuratedOutfitPhotoUrl(_city: string, topic: OutfitTopicId): string {
  return unsplashPhotoUrl(OUTFIT_TOPIC_IDS[topic], 600, 720);
}

export function getCuratedOutfitHeroUrl(_city: string, topic: OutfitTopicId): string {
  return unsplashPhotoUrl(OUTFIT_TOPIC_IDS[topic], 800, 480);
}

export function getCuratedOutfitFallbackUrl(topic: OutfitTopicId): string {
  return unsplashPhotoUrl(OUTFIT_TOPIC_FALLBACK_IDS[topic], 600, 720);
}
