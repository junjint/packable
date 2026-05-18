import {
  BookOpen,
  BriefcaseBusiness,
  Cable,
  Dumbbell,
  Footprints,
  Glasses,
  Landmark,
  Laptop,
  Notebook,
  Pill,
  Shirt,
  ShowerHead,
  Sparkles,
  Sun,
  Tag,
  Umbrella,
  WalletCards,
  Waves,
} from "lucide-react";
import type {
  Bag,
  BagSummary,
  Category,
  Compartment,
  ContainerType,
  PackingItem,
  PackingPlanData,
  SuitcaseSize,
  TripForm,
  WeatherMode,
} from "./types";

export const containerTypeMeta: Record<ContainerType, { label: string; helper: string }> = {
  suitcase: { label: "Suitcase", helper: "Two structured halves" },
  "carry-on": { label: "Carry-on", helper: "Compact suitcase layout" },
  duffle: { label: "Duffle", helper: "Soft single compartment" },
  backpack: { label: "Backpack", helper: "Stacked pockets" },
  tote: { label: "Tote", helper: "Open main space" },
};

export const luggageSizeMeta: Record<ContainerType, Record<SuitcaseSize, { label: string; dimensions: string; capacity: number }>> = {
  suitcase: {
    small: { label: "Small", dimensions: "22 x 14 x 9 in", capacity: 35 },
    medium: { label: "Medium", dimensions: "26 x 18 x 11 in", capacity: 60 },
    large: { label: "Large", dimensions: "30 x 20 x 12 in", capacity: 90 },
  },
  "carry-on": {
    small: { label: "Small", dimensions: "20 x 13 x 8 in", capacity: 30 },
    medium: { label: "Medium", dimensions: "22 x 14 x 9 in", capacity: 38 },
    large: { label: "Large", dimensions: "24 x 16 x 10 in", capacity: 48 },
  },
  duffle: {
    small: { label: "Compact", dimensions: "30L soft bag", capacity: 26 },
    medium: { label: "Standard", dimensions: "45L soft bag", capacity: 42 },
    large: { label: "Large", dimensions: "65L soft bag", capacity: 62 },
  },
  backpack: {
    small: { label: "Compact", dimensions: "20L day pack", capacity: 18 },
    medium: { label: "Standard", dimensions: "35L travel pack", capacity: 32 },
    large: { label: "Large", dimensions: "50L travel pack", capacity: 48 },
  },
  tote: {
    small: { label: "Compact", dimensions: "Small open tote", capacity: 12 },
    medium: { label: "Standard", dimensions: "Daily tote", capacity: 18 },
    large: { label: "Large", dimensions: "Oversized tote", capacity: 26 },
  },
};

const dayMs = 1000 * 60 * 60 * 24;

export function getTripDays(form: TripForm): number {
  const segments = [
    { startDate: form.startDate, endDate: form.endDate },
    ...form.segments.map((segment) => ({ startDate: segment.startDate, endDate: segment.endDate })),
  ];

  return Math.max(
    1,
    segments.reduce((total, segment) => {
      const start = new Date(segment.startDate);
      const end = new Date(segment.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return total + 1;
      return total + Math.max(1, Math.round((end.getTime() - start.getTime()) / dayMs));
    }, 0),
  );
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "dates pending";

  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(start);
  const endMonth = new Intl.DateTimeFormat("en", { month: "short" }).format(end);
  const sameMonth = start.getMonth() === end.getMonth();
  return sameMonth ? `${month} ${start.getDate()}-${end.getDate()}` : `${month} ${start.getDate()}-${endMonth} ${end.getDate()}`;
}

export function getWeatherProfile(form: TripForm): { mode: Exclude<WeatherMode, "Auto">; weatherSummary: string; seasonSummary: string } {
  if (form.weatherMode !== "Auto") {
    const summaries: Record<Exclude<WeatherMode, "Auto">, string> = {
      Hot: "Hot weather, low rain chance",
      Mild: "Mild weather, flexible layers",
      Cold: "Cold weather, warm layers needed",
      Rainy: "Rain likely, pack rain protection",
      Mixed: "Mixed weather, pack adaptable layers",
      Spring: "Mild spring weather, light layers",
      Summer: "Hot summer weather, sun protection useful",
      Fall: "Cool fall weather, pack layers",
      Winter: "Cold winter weather, warm layers needed",
    };
    const modeMap: Record<Exclude<WeatherMode, "Auto">, Exclude<WeatherMode, "Auto">> = {
      Hot: "Hot",
      Mild: "Mild",
      Cold: "Cold",
      Rainy: "Rainy",
      Mixed: "Mixed",
      Spring: "Mild",
      Summer: "Hot",
      Fall: "Mixed",
      Winter: "Cold",
    };
    return { mode: modeMap[form.weatherMode], weatherSummary: summaries[form.weatherMode], seasonSummary: `${form.weatherMode} season` };
  }

  const month = new Date(`${form.startDate}T00:00:00`).getMonth() + 1;
  const destination = form.destination.toLowerCase();
  const northernSummer = month >= 6 && month <= 9;
  const northernWinter = month === 12 || month <= 2;
  const beachy = destination.includes("barcelona") || destination.includes("miami") || destination.includes("cancun") || destination.includes("lisbon");

  if (northernSummer && beachy) return { mode: "Hot", weatherSummary: "Hot weather, low rain chance", seasonSummary: "Summer / warm season" };
  if (northernWinter) return { mode: "Cold", weatherSummary: "Cold weather, warm layers likely", seasonSummary: "Winter / cold season" };
  return { mode: "Mild", weatherSummary: "Mild weather, flexible layers", seasonSummary: "Shoulder season" };
}

function getActiveBag(form: TripForm): Bag {
  return form.bags.find((bag) => bag.id === form.activeBagId) ?? form.bags[0] ?? {
    id: "bag-main",
    nickname: "Main suitcase",
    containerType: form.containerType,
    suitcase: form.suitcase,
    weightLimit: form.weightLimit,
  };
}

function defaultCompartment(containerType: ContainerType, category: Category): Compartment {
  if (containerType === "duffle" || containerType === "tote") return "main";
  if (containerType === "backpack") {
    if (category === "Electronics" || category === "Travel Documents" || category === "Toiletries") return "front";
    if (category === "Weather") return "top";
    if (category === "Shoes") return "bottom";
    return "main";
  }
  if (category === "Shoes" || category === "Toiletries" || category === "Electronics" || category === "Travel Documents") return "right";
  return "left";
}

function item(
  form: TripForm,
  id: string,
  name: string,
  category: Category,
  quantity: number,
  unitWeight: number,
  unitVolume: number,
  icon: PackingItem["icon"],
  extras: Partial<PackingItem> = {},
): PackingItem {
  const bag = getActiveBag(form);
  const roundedQuantity = Math.max(0, Math.round(quantity));
  return {
    id,
    name,
    category,
    quantity: roundedQuantity,
    recommendedQuantity: roundedQuantity,
    unitWeight,
    unitVolume,
    compartment: defaultCompartment(bag.containerType, category),
    bagId: bag.id,
    icon,
    checked: false,
    ...extras,
  };
}

export function generatePackingPlan(form: TripForm, warningDismissed = false): PackingPlanData {
  const days = getTripDays(form);
  const weather = getWeatherProfile(form);
  const has = (value: string) => form.priorities.includes(value) || form.activities.includes(value);
  const laundry = has("Laundry access") || has("Laundry-friendly");
  const minimal = has("Minimal");
  const variety = has("Outfit variety");
  const shoppingReserve = getShoppingReservePercent(form);
  const leaveSpace = has("Leave extra space") || shoppingReserve >= 15;
  const rainy = weather.mode === "Rainy";
  const hot = weather.mode === "Hot";
  const cold = weather.mode === "Cold";
  const mixed = weather.mode === "Mixed";
  const work = has("Work");
  const school = has("School");
  const formal = has("Formal event");
  const hiking = has("Hiking");
  const beach = has("Beach");
  const workout = has("Workout");
  const nightlife = has("Nightlife");
  const dinner = has("Dinner");

  let tops = laundry ? Math.ceil(days * 0.58) : days;
  if (minimal || leaveSpace) tops = Math.max(3, tops - 2);
  if (variety) tops += 2;

  const shortSleeves = hot ? Math.max(2, tops - 2) : Math.max(1, Math.ceil(tops * 0.55));
  const nicerTops = work || formal || nightlife || dinner ? 1 : hot ? 1 : 0;
  const longSleeves = Math.max(0, tops - shortSleeves - nicerTops);
  const pants = Math.max(1, Math.ceil(days / (laundry ? 4 : 3)));
  const shorts = hot || beach ? Math.max(1, Math.ceil(days / 4)) : 0;

  const items: PackingItem[] = [
    item(form, "short-sleeve-shirts", "Short sleeve shirts", "Clothing", shortSleeves, 0.35, 0.9, Shirt, {
      recommended: true,
      reason: `Recommended because your trip is ${days} days, ${weather.weatherSummary.toLowerCase()}, and tops are daily-use items.`,
      specificItems: hot ? ["Light cotton T-shirts", "Linen or breathable tops", "A neutral top that can repeat"] : ["Everyday T-shirts", "Easy layering top"],
    }),
    item(form, "nicer-top", "Nicer top", "Clothing", nicerTops, 0.4, 0.75, Shirt, {
      recommended: Boolean(nicerTops),
      optional: true,
      reason: nightlife || formal || dinner ? "Added for dinner, evening, or formal plans." : "Added so one outfit can feel more polished.",
      specificItems: ["Breathable button-up, blouse, or nicer tee"],
    }),
    item(form, "long-sleeve", "Breathable long sleeve", "Clothing", longSleeves, 0.45, 0.9, Shirt, {
      optional: true,
      reason: mixed || hot ? "Useful for sun coverage, flights, and cooler evenings." : "Useful as a light layer.",
      specificItems: ["Thin long sleeve", "Light overshirt"],
    }),
    item(form, "pants", "Pants", "Clothing", pants, 1, 1.8, Glasses, {
      recommended: true,
      reason: `About one pair every 2-3 days${laundry ? ", reduced because laundry access is selected" : ""}.`,
      specificItems: ["One comfortable travel pant", "One versatile darker pant"],
    }),
    item(form, "shorts", "Shorts", "Clothing", shorts, 0.45, 1, Shirt, {
      recommended: hot || beach,
      optional: true,
      reason: "Added for warm weather and casual daytime plans.",
      specificItems: ["Lightweight shorts", "Beach or casual short"],
    }),
    item(form, "underwear", "Underwear", "Clothing", days, 0.1, 0.35, Tag, {
      recommended: true,
      reason: "One pair per travel day.",
    }),
    item(form, "socks", hot ? "Light socks" : "Socks", "Clothing", days, 0.1, 0.3, Tag, {
      recommended: true,
      reason: "One pair per travel day.",
    }),
    item(form, "pajamas", "Pajamas", "Clothing", Math.max(1, Math.ceil(days / 7)), 0.7, 1.3, Shirt, {
      recommended: true,
      reason: "Sleepwear is included for all trips.",
    }),
    item(form, "walking-shoes", "Comfortable walking shoes", "Shoes", 1, 2, 3.2, Footprints, {
      recommended: true,
      reason: has("Sightseeing") ? "Recommended because sightseeing usually means long walking days." : "Recommended as a reliable daily shoe.",
      specificItems: ["Broken-in sneakers", "Supportive walking shoe"],
    }),
    item(form, "toothbrush", "Toothbrush", "Toiletries", 1, 0.1, 0.2, Sparkles, { recommended: true, reason: "Core toiletry." }),
    item(form, "toothpaste", "Toothpaste", "Toiletries", 1, 0.2, 0.25, Sparkles, { recommended: true, reason: "Core toiletry." }),
    item(form, "deodorant", "Deodorant", "Toiletries", 1, 0.3, 0.35, Sparkles, { recommended: true, reason: "Core toiletry." }),
    item(form, "face-wash", "Face wash", "Toiletries", form.essentialGroups.includes("Skincare") ? 1 : 0, 0.3, 0.35, ShowerHead, {
      recommended: form.essentialGroups.includes("Skincare"),
      reason: "Added from skincare essentials.",
    }),
    item(form, "sunscreen", "Sunscreen", "Toiletries", hot || beach ? 1 : 0, 0.5, 0.55, Sun, {
      recommended: hot || beach,
      reason: "Recommended for hot weather, beach plans, and sun exposure.",
    }),
    item(form, "shampoo", "Travel shampoo", "Toiletries", form.essentialGroups.includes("Toiletries") ? 1 : 0, 0.35, 0.35, ShowerHead, {
      optional: true,
      reason: "Travel-size toiletry.",
    }),
    item(form, "conditioner", "Travel conditioner", "Toiletries", form.essentialGroups.includes("Toiletries") ? 1 : 0, 0.35, 0.35, ShowerHead, {
      optional: true,
      reason: "Travel-size toiletry.",
    }),
    item(form, "phone-charger", "Phone charger", "Electronics", 1, 0.3, 0.3, Cable, { recommended: true, reason: "Daily-use travel essential." }),
    item(form, "passport", "Passport / ID", "Travel Documents", 1, 0.1, 0.1, Landmark, { recommended: true, reason: "Required identity documents." }),
    item(form, "wallet", "Wallet", "Travel Documents", 1, 0.2, 0.15, WalletCards, { recommended: true, reason: "Cards and cash." }),
    item(form, "medications", "Medications", "Travel Documents", form.essentialGroups.includes("Medications") ? 1 : 0, 0.2, 0.25, Pill, {
      recommended: form.essentialGroups.includes("Medications"),
      reason: "Selected as an essential group.",
    }),
  ];

  const customEssentials = form.customEssentials ?? [];
  customEssentials.forEach((name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) return;
    items.push(
      item(form, `custom-essential-${slug}`, name.trim(), "Travel Documents", 1, 0.15, 0.3, Tag, {
        recommended: true,
        reason: `Added as a custom essential: ${name.trim()}.`,
      }),
    );
  });

  if (rainy) {
    items.push(
      item(form, "umbrella", "Compact umbrella", "Weather", 1, 0.8, 1.2, Umbrella, {
        recommended: true,
        optional: true,
        reason: "Added because rainy weather is selected or likely.",
      }),
      item(form, "rain-jacket", "Light rain jacket", "Weather", 1, 1.2, 1.7, Umbrella, {
        recommended: true,
        optional: true,
        reason: "Keeps rain protection lighter than a heavy coat.",
      }),
      item(form, "water-resistant-shoes", "Water-resistant shoes", "Weather", 1, 1.9, 2.8, Footprints, {
        optional: true,
        reason: "Optional if rain is likely and you expect long walks.",
      }),
    );
  }

  if (cold) {
    items.push(
      item(form, "warm-jacket", "Warm jacket", "Weather", 1, 2.5, 4, Shirt, { recommended: true, reason: "Added for cold weather." }),
      item(form, "sweater", "Sweater", "Clothing", 2, 1.1, 2, Shirt, { recommended: true, reason: "Layering helps with cold days." }),
      item(form, "warm-socks", "Warm socks", "Clothing", Math.ceil(days / 2), 0.15, 0.4, Tag, { recommended: true, reason: "Added for cold weather." }),
      item(form, "gloves", "Gloves", "Weather", 1, 0.2, 0.3, Tag, { optional: true, reason: "Useful if it gets very cold." }),
    );
  }

  if (work || formal) {
    items.push(
      item(form, "dress-shirt", "Dress shirt", "Clothing", 1, 0.5, 0.9, BriefcaseBusiness, {
        recommended: true,
        optional: true,
        reason: work ? "Added for work activities." : "Added for formal plans.",
      }),
      item(form, "blazer", "Blazer", "Clothing", work ? 1 : 0, 1.5, 2.8, BriefcaseBusiness, {
        optional: true,
        reason: "Optional polished layer for work.",
      }),
    );
  }

  if (school || work || form.essentialGroups.includes("School/work items")) {
    items.push(
      item(form, "laptop", "Laptop", "Electronics", 1, 3, 2.4, Laptop, { recommended: school || work, reason: school ? "Added for school." : "Added for work." }),
      item(form, "notebook", "Notebook", "Electronics", school ? 1 : 0, 0.7, 0.6, Notebook, { recommended: school, reason: "Added for school notes." }),
      item(form, "laptop-charger", "Laptop charger", "Electronics", 1, 0.8, 0.6, Cable, { recommended: school || work, reason: "Pairs with laptop." }),
    );
  }

  if (hiking) {
    items.push(
      item(form, "hiking-shoes", "Hiking shoes", "Shoes", 1, 2.4, 3.4, Footprints, { recommended: true, optional: true, reason: "Added for hiking." }),
      item(form, "athletic-socks", "Athletic socks", "Activity Gear", 2, 0.12, 0.35, Tag, { recommended: true, optional: true, reason: "Added for hiking comfort." }),
      item(form, "day-pack", "Light backpack", "Activity Gear", 1, 1, 2, BriefcaseBusiness, { optional: true, reason: "Useful for trails and day trips." }),
    );
  }

  if (beach) {
    items.push(
      item(form, "swimsuit", "Swimsuit", "Activity Gear", 1, 0.3, 0.5, Waves, { recommended: true, optional: true, reason: "Added for beach plans." }),
      item(form, "sandals", "Sandals", "Shoes", 1, 1, 1.7, Footprints, { recommended: true, optional: true, reason: "Useful for beach days." }),
    );
  }

  if (workout) {
    items.push(
      item(form, "workout-outfit", "Workout outfit", "Activity Gear", 1, 0.7, 1.1, Dumbbell, { recommended: true, optional: true, reason: "Added for workout plans." }),
      item(form, "training-shoes", "Training shoes", "Shoes", 1, 1.7, 2.6, Footprints, { optional: true, reason: "Optional if separate from walking shoes." }),
    );
  }

  if (nightlife || dinner) {
    items.push(item(form, "evening-outfit", "Evening outfit", "Clothing", 1, 1, 1.6, Shirt, {
      recommended: true,
      optional: true,
      reason: nightlife ? "Added for nightlife plans." : "Added for dinner plans.",
      specificItems: ["Polished top", "Comfortable but nicer shoes", "Light layer"],
    }));
  }

  const filtered = items.filter((planItem) => planItem.quantity > 0);
  const adjusted = adjustItemsForShoppingSpace(form, filtered);
  return summarizePlan(form, adjusted.filter((planItem) => planItem.quantity > 0), warningDismissed);
}

export function getShoppingReservePercent(form: TripForm): number {
  const value = form.shoppingSpacePercent;
  if (typeof value === "number" && !Number.isNaN(value)) {
    return Math.min(40, Math.max(0, Math.round(value)));
  }
  return 20;
}

const trimmableOptionalIds = [
  "training-shoes",
  "blazer",
  "water-resistant-shoes",
  "sandals",
  "nicer-top",
  "long-sleeve",
  "evening-outfit",
  "shorts",
  "athletic-socks",
  "day-pack",
  "swimsuit",
];

export function adjustItemsForShoppingSpace(form: TripForm, items: PackingItem[]): PackingItem[] {
  const reserve = getShoppingReservePercent(form);
  if (reserve <= 10) return items;

  const intensity = reserve / 40;

  return items.map((planItem) => {
    if (!planItem.optional) return planItem;

    if (intensity >= 0.85 && trimmableOptionalIds.includes(planItem.id)) {
      return { ...planItem, quantity: 0 };
    }
    if (intensity >= 0.6 && trimmableOptionalIds.includes(planItem.id)) {
      return { ...planItem, quantity: Math.max(0, planItem.quantity - 1) };
    }
    if (intensity >= 0.4 && planItem.quantity > 1) {
      return { ...planItem, quantity: planItem.quantity - 1 };
    }
    return planItem;
  });
}

function summarizeBag(form: TripForm, bag: Bag, items: PackingItem[]): BagSummary {
  const bagItems = items.filter((planItem) => planItem.bagId === bag.id);
  const estimatedWeight = bagItems.reduce((total, planItem) => total + planItem.quantity * planItem.unitWeight, 0);
  const totalVolume = bagItems.reduce((total, planItem) => total + planItem.quantity * planItem.unitVolume, 0);
  const capacity = luggageSizeMeta[bag.containerType][bag.suitcase].capacity;
  const desiredReserve = getShoppingReservePercent(form);
  const adjustedCapacity = Math.max(1, capacity * (1 - desiredReserve / 100));
  const fullnessPercent = Math.min(100, Math.round((totalVolume / capacity) * 100));
  return {
    bagId: bag.id,
    label: bag.nickname || containerTypeMeta[bag.containerType].label,
    estimatedWeight,
    totalVolume,
    capacity,
    weightLimit: bag.weightLimit,
    fullnessPercent,
    roomLeftPercent: Math.max(0, 100 - fullnessPercent),
    overweight: estimatedWeight > bag.weightLimit,
    overVolume: totalVolume > adjustedCapacity,
  };
}

export function summarizePlan(form: TripForm, items: PackingItem[], warningDismissed = false): PackingPlanData {
  const bags = form.bags.length ? form.bags : [getActiveBag(form)];
  const bagSummaries = bags.map((bag) => summarizeBag(form, bag, items));
  const activeBagId = form.activeBagId || bags[0].id;
  const activeSummary = bagSummaries.find((summary) => summary.bagId === activeBagId) ?? bagSummaries[0];
  const weather = getWeatherProfile(form);
  const totalEstimatedWeight = bagSummaries.reduce((total, bag) => total + bag.estimatedWeight, 0);
  const totalVolume = bagSummaries.reduce((total, bag) => total + bag.totalVolume, 0);

  return {
    items,
    estimatedWeight: activeSummary.estimatedWeight,
    totalEstimatedWeight,
    totalVolume,
    capacity: activeSummary.capacity,
    fullnessPercent: activeSummary.fullnessPercent,
    emptySpacePercent: activeSummary.roomLeftPercent,
    shoppingSpacePercent: getShoppingReservePercent(form),
    seasonSummary: weather.seasonSummary,
    weatherSummary: weather.weatherSummary,
    bagSummaries,
    activeBagId,
    overweight: bagSummaries.some((bag) => bag.overweight),
    overVolume: bagSummaries.some((bag) => bag.overVolume),
    warningDismissed,
  };
}

export function reduceNonEssentials(form: TripForm, plan: PackingPlanData): PackingPlanData {
  const reduced = plan.items.map((planItem) => {
    if (!planItem.optional) return planItem;
    if (["training-shoes", "blazer", "water-resistant-shoes", "sandals", "nicer-top", "long-sleeve"].includes(planItem.id)) {
      return { ...planItem, quantity: Math.max(0, planItem.quantity - 1) };
    }
    return { ...planItem, quantity: Math.max(1, planItem.quantity - 1) };
  });

  return summarizePlan(form, reduced.filter((planItem) => planItem.quantity > 0), false);
}

export function nextSuitcaseSize(size: SuitcaseSize): SuitcaseSize {
  if (size === "small") return "medium";
  if (size === "medium") return "large";
  return "large";
}
