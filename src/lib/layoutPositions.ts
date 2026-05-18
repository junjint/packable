import type { ContainerType } from "../types";

export type LayoutBlockId = "Clothing" | "Shoes" | "Toiletries" | "TechDocs" | "Essentials";

export interface BlockPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type LayoutPositions = Record<LayoutBlockId, BlockPosition>;

/** One shared two-compartment layout for every bag type. */
const UNIFIED_LAYOUT_DEFAULTS: LayoutPositions = {
  Clothing: { x: 4, y: 10, w: 44, h: 48 },
  Shoes: { x: 4, y: 62, w: 44, h: 28 },
  Toiletries: { x: 52, y: 8, w: 42, h: 30 },
  TechDocs: { x: 52, y: 42, w: 42, h: 26 },
  Essentials: { x: 52, y: 72, w: 42, h: 22 },
};

export function getDefaultLayoutPositions(_containerType?: ContainerType): LayoutPositions {
  return { ...UNIFIED_LAYOUT_DEFAULTS };
}

export function layoutStorageKey(tripName: string, bagId: string): string {
  return `packing-layout-positions:${tripName}:${bagId}`;
}

export function loadLayoutPositions(tripName: string, bagId: string, _containerType?: ContainerType): LayoutPositions {
  try {
    const raw = localStorage.getItem(layoutStorageKey(tripName, bagId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LayoutPositions>;
      return { ...getDefaultLayoutPositions(), ...parsed };
    }
  } catch {
    /* use defaults */
  }
  return getDefaultLayoutPositions();
}

export function saveLayoutPositions(tripName: string, bagId: string, positions: LayoutPositions): void {
  localStorage.setItem(layoutStorageKey(tripName, bagId), JSON.stringify(positions));
}

/** Scale block footprint by how many items sit in that section (empty = smaller). */
export function getResponsiveBlockDimensions(
  base: BlockPosition,
  itemCount: number,
): Pick<BlockPosition, "w" | "h"> {
  let scale: number;
  if (itemCount <= 0) scale = 0.48;
  else if (itemCount <= 2) scale = 0.64;
  else if (itemCount <= 5) scale = 0.78;
  else if (itemCount <= 10) scale = 0.92;
  else if (itemCount <= 16) scale = 1.02;
  else scale = 1.14;

  const minW = 18;
  const minH = 11;
  const maxW = Math.min(50, base.w * 1.22);
  const maxH = Math.min(54, base.h * 1.22);

  return {
    w: Math.round(Math.min(maxW, Math.max(minW, base.w * scale)) * 10) / 10,
    h: Math.round(Math.min(maxH, Math.max(minH, base.h * scale)) * 10) / 10,
  };
}

export type LayoutCanvasDensity = "empty" | "light" | "medium" | "full";

export function getLayoutCanvasDensity(totalItemCount: number): LayoutCanvasDensity {
  if (totalItemCount <= 0) return "empty";
  if (totalItemCount <= 8) return "light";
  if (totalItemCount <= 22) return "medium";
  return "full";
}
