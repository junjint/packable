import type { TripForm } from "../types";

export type OutfitTopicId = "everyday" | "shoes" | "evening" | "weather";

export interface OutfitTopic {
  id: OutfitTopicId;
  cardTitle: string;
  gradientKey: string;
}

export interface OutfitDetail {
  id: OutfitTopicId;
  title: string;
  summary: string;
  suggestions: string[];
  packItems: string[];
}

function cityName(trip: TripForm): string {
  return trip.destination?.split(",")[0]?.trim() || "your destination";
}

function isRainy(trip: TripForm): boolean {
  return trip.weatherMode === "Rainy" || trip.weatherMode === "Mixed";
}

function isHot(trip: TripForm): boolean {
  return ["Hot", "Summer"].includes(trip.weatherMode);
}

function isCold(trip: TripForm): boolean {
  return ["Cold", "Winter"].includes(trip.weatherMode);
}

function hasActivity(trip: TripForm, name: string): boolean {
  return trip.activities.includes(name);
}

export function getOutfitTopics(trip: TripForm): OutfitTopic[] {
  const rainy = isRainy(trip);
  const topics: OutfitTopic[] = [
    { id: "everyday", cardTitle: "Everyday style", gradientKey: "layers" },
    { id: "shoes", cardTitle: "Comfortable shoes", gradientKey: "shoes" },
    { id: "evening", cardTitle: "Evening outfits", gradientKey: "evening" },
  ];
  if (rainy || isCold(trip)) {
    topics.push({ id: "weather", cardTitle: "Weather layers", gradientKey: rainy ? "rain" : "layers" });
  } else {
    topics.push({ id: "weather", cardTitle: "Weather layers", gradientKey: "fabrics" });
  }
  return topics.slice(0, 4);
}

export function getOutfitDetail(trip: TripForm, topicId: OutfitTopicId): OutfitDetail {
  const city = cityName(trip);
  const rainy = isRainy(trip);
  const hot = isHot(trip);
  const cold = isCold(trip);
  const formal = hasActivity(trip, "Formal event") || hasActivity(trip, "Dinner");
  const nightlife = hasActivity(trip, "Nightlife");
  const beach = hasActivity(trip, "Beach");
  const hiking = hasActivity(trip, "Hiking");

  if (topicId === "everyday") {
    const summary = hot
      ? `${city} style is usually relaxed and practical—breathable fabrics, light layers, and outfits that work from daytime exploring to casual dinner.`
      : cold
        ? `${city} calls for layered everyday outfits: a warm base, a mid-layer, and an outer layer you can remove indoors.`
        : `${city} style is usually casual but polished, with breathable fabrics, comfortable walking shoes, and outfits that transition from daytime exploring to dinner.`;

    const suggestions = [
      hot ? "Pack breathable tops you can re-wear" : "Pack mix-and-match tops in neutral colors",
      "Bring one light layer for evenings or air-conditioned spaces",
      beach ? "Add a cover-up or easy layer for the beach" : "Choose fabrics that pack small and dry quickly",
      "Avoid overpacking bulky pieces—repeat staples instead",
    ];

    const packItems = [
      hot ? "2–4 breathable tops" : "2–3 versatile tops",
      "1 comfortable pant + 1 optional short/skirt",
      "Light cardigan or overshirt",
      hiking ? "Quick-dry hiking layer" : "Compact day bag layer",
    ];

    return { id: topicId, title: `Everyday style in ${city}`, summary, suggestions, packItems };
  }

  if (topicId === "shoes") {
    return {
      id: topicId,
      title: `Comfortable shoes in ${city}`,
      summary: `Most visitors in ${city} walk far more than usual. Prioritize broken-in sneakers or supportive walking shoes, and add one nicer pair only if you have evening plans.`,
      suggestions: [
        "Wear your walking shoes on travel day to save bag space",
        formal || nightlife ? "Bring one polished but comfortable pair for evenings" : "One pair of shoes is often enough for short city trips",
        beach ? "Pack sandals that can handle sand and short walks" : "Skip brand-new shoes—blisters ruin trips",
        rainy ? "Water-resistant or quick-dry shoes help on wet days" : "Add insoles if you plan long sightseeing days",
      ],
      packItems: [
        "Broken-in walking sneakers",
        formal || nightlife ? "One dressier flat or clean sneaker" : "Optional backup flats",
        beach ? "Sandals" : null,
        hiking ? "Trail shoes with grip" : null,
      ].filter(Boolean) as string[],
    };
  }

  if (topicId === "evening") {
    return {
      id: topicId,
      title: `Evening outfits in ${city}`,
      summary:
        formal || nightlife
          ? `${city} evenings can lean smarter—think one elevated outfit that still feels comfortable after a full day out.`
          : `You may only need one nicer outfit in ${city}: something that upgrades jeans or a simple dress without feeling overdressed.`,
      suggestions: [
        "Pack one outfit that works for dinner and nicer bars",
        "Choose wrinkle-resistant fabrics for packing",
        hot ? "A linen shirt or light dress layers well" : "A merino top or thin sweater dresses up easily",
        "Keep jewelry and accessories minimal but intentional",
      ],
      packItems: [
        "1 nicer top or blouse",
        "1 versatile bottom (dark jeans, trousers, or dress)",
        formal ? "Light blazer or structured layer" : "Optional light jacket",
        "One dressier shoe (if not wearing walking shoes)",
      ],
    };
  }

  return {
    id: topicId,
    title: `Weather layers in ${city}`,
    summary: rainy
      ? `Rain is in the forecast for ${city}. Pack layers you can add and remove quickly, plus protection that does not soak your bag.`
      : cold
        ? `Cooler weather in ${city} means layers matter more than bulk—thin warm pieces beat one heavy coat.`
        : `Even in mild ${city} weather, evenings and indoor AC can feel cooler. A packable layer saves comfort without much space.`,
    suggestions: [
      rainy ? "Bring a compact rain jacket or packable shell" : "Pack a light jacket or cardigan",
      cold ? "Base layer + mid-layer beats one heavy sweater" : "A scarf or light wrap works for evenings",
      "Choose layers that compress in your bag",
      "Check forecast the day before—you can trim one layer if needed",
    ],
    packItems: [
      rainy ? "Packable rain jacket" : "Lightweight jacket",
      cold ? "Thin fleece or merino mid-layer" : "Cardigan or overshirt",
      rainy ? "Compact umbrella" : "Optional light scarf",
      "One pair of socks kept dry for wet days",
    ],
  };
}
