import type { LucideIcon } from "lucide-react";

export type Screen = "welcome" | "setup" | "details" | "personalization" | "loading" | "plan" | "list";

export type SuitcaseSize = "small" | "medium" | "large";

export type ContainerType = "suitcase" | "carry-on" | "duffle" | "backpack" | "tote";

export type WeatherMode = "Auto" | "Hot" | "Mild" | "Cold" | "Rainy" | "Mixed" | "Spring" | "Summer" | "Fall" | "Winter";

export type EssentialGroup = "Toiletries" | "Electronics" | "Travel documents" | "Medications" | "Skincare" | "School/work items";

export type Category =
  | "Clothing"
  | "Toiletries"
  | "Electronics"
  | "Travel Documents"
  | "Shoes"
  | "Activity Gear"
  | "Weather";

export type Compartment = "left" | "right" | "main" | "front" | "top" | "bottom" | "pocket";

export interface TripSegment {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export interface Bag {
  id: string;
  nickname: string;
  containerType: ContainerType;
  suitcase: SuitcaseSize;
  weightLimit: number;
}

export interface AirlineLimit {
  enabled: boolean;
  airline: string;
  bagType: "Checked bag" | "Carry-on" | "Personal item";
  weightLimit: number;
}

export interface TripForm {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  segments: TripSegment[];
  bags: Bag[];
  activeBagId: string;
  containerType: ContainerType;
  suitcase: SuitcaseSize;
  weightLimit: number;
  weatherMode: WeatherMode;
  itineraryUploaded: boolean;
  airlineLimit: AirlineLimit;
  essentialGroups: EssentialGroup[];
  customEssentials: string[];
  priorities: string[];
  activities: string[];
  /** Percent of bag volume to reserve for shopping (0–40). */
  shoppingSpacePercent: number;
}

export interface PackingItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unitWeight: number;
  unitVolume: number;
  compartment: Compartment;
  bagId: string;
  recommendedQuantity: number;
  recommended?: boolean;
  optional?: boolean;
  checked?: boolean;
  breakdown?: string;
  reason?: string;
  specificItems?: string[];
  icon: LucideIcon;
}

export interface BagSummary {
  bagId: string;
  label: string;
  estimatedWeight: number;
  totalVolume: number;
  capacity: number;
  weightLimit: number;
  fullnessPercent: number;
  roomLeftPercent: number;
  overweight: boolean;
  overVolume: boolean;
}

export interface PackingPlanData {
  items: PackingItem[];
  estimatedWeight: number;
  totalEstimatedWeight: number;
  totalVolume: number;
  capacity: number;
  fullnessPercent: number;
  emptySpacePercent: number;
  shoppingSpacePercent: number;
  seasonSummary: string;
  weatherSummary: string;
  bagSummaries: BagSummary[];
  activeBagId: string;
  overweight: boolean;
  overVolume: boolean;
  warningDismissed: boolean;
}

export interface CustomItemDraft {
  name: string;
  category: Category;
  estimatedWeight: string;
  quantity: string;
}
