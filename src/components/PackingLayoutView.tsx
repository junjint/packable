import { Footprints, Heart, Laptop, Shirt, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  getLayoutCanvasDensity,
  getResponsiveBlockDimensions,
  type BlockPosition,
  type LayoutBlockId,
  type LayoutPositions,
} from "../lib/layoutPositions";
import type { Category, PackingItem, PackingPlanData, TripForm } from "../types";

export type LayoutFilter = "All" | LayoutBlockId;

interface LayoutBlock {
  id: LayoutBlockId;
  label: string;
  icon: LucideIcon;
  categories: Category[];
  matchesItem: (item: PackingItem) => boolean;
}

const blockColorClass: Record<LayoutBlockId, string> = {
  Clothing: "layout-block--clothing",
  Shoes: "layout-block--shoes",
  Toiletries: "layout-block--toiletries",
  TechDocs: "layout-block--tech-docs",
  Essentials: "layout-block--essentials",
};

const blocks: LayoutBlock[] = [
  {
    id: "Clothing",
    label: "Clothing",
    icon: Shirt,
    categories: ["Clothing", "Weather", "Activity Gear"],
    matchesItem: (item) => ["Clothing", "Weather", "Activity Gear"].includes(item.category),
  },
  {
    id: "Shoes",
    label: "Shoes",
    icon: Footprints,
    categories: ["Shoes"],
    matchesItem: (item) => item.category === "Shoes",
  },
  {
    id: "Toiletries",
    label: "Toiletries",
    icon: Sparkles,
    categories: ["Toiletries"],
    matchesItem: (item) => item.category === "Toiletries" && !item.id.startsWith("custom-essential-"),
  },
  {
    id: "TechDocs",
    label: "Tech / Docs",
    icon: Laptop,
    categories: ["Electronics"],
    matchesItem: (item) => item.category === "Electronics",
  },
  {
    id: "Essentials",
    label: "Essentials",
    icon: Heart,
    categories: ["Travel Documents"],
    matchesItem: (item) => item.category === "Travel Documents" || item.id.startsWith("custom-essential-"),
  },
];

export const layoutFilterTitles: Record<LayoutFilter, string> = {
  All: "All items",
  Clothing: "Clothing",
  Shoes: "Shoes",
  Toiletries: "Toiletries",
  TechDocs: "Tech & Documents",
  Essentials: "Essentials",
};

export function itemMatchesLayoutFilter(item: PackingItem, filter: LayoutFilter): boolean {
  if (filter === "All") return true;
  const block = blocks.find((b) => b.id === filter);
  return block ? block.matchesItem(item) : false;
}

export function getLayoutBlockIdForItem(item: PackingItem): LayoutBlockId | null {
  const block = blocks.find((b) => b.matchesItem(item));
  return block?.id ?? null;
}

interface PackingLayoutViewProps {
  trip: TripForm;
  plan: PackingPlanData;
  selected: LayoutFilter;
  positions: LayoutPositions;
  onPositionsChange: (positions: LayoutPositions) => void;
  onSelectCategory: (filter: LayoutFilter) => void;
  onResetLayout: () => void;
  onChooseItems?: () => void;
  pulsingBlockId?: LayoutBlockId | null;
}

function countForBlock(items: PackingItem[], block: LayoutBlock): number {
  return items.filter(block.matchesItem).reduce((sum, item) => sum + item.quantity, 0);
}

function unitLabel(block: LayoutBlock, count: number): string {
  if (block.id === "Shoes") return count === 1 ? "pair" : "pairs";
  return count === 1 ? "item" : "items";
}

function blockFillClass(count: number): string {
  if (count <= 0) return "layout-block--empty";
  if (count <= 3) return "layout-block--light";
  if (count <= 10) return "layout-block--medium";
  return "layout-block--full";
}

export function PackingLayoutView({
  trip,
  plan,
  selected,
  positions,
  onPositionsChange,
  onSelectCategory,
  onResetLayout,
  onChooseItems,
  pulsingBlockId,
}: PackingLayoutViewProps) {
  const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId) ?? trip.bags[0];
  const items = plan.items.filter((item) => item.bagId === activeBag.id);
  const isEmptyBag = items.length === 0;
  const canvasRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef(positions);
  const dragRef = useRef<{ id: LayoutBlockId; startX: number; startY: number; origin: BlockPosition; moved: boolean } | null>(null);

  const [hovered, setHovered] = useState<LayoutBlockId | null>(null);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const canvasDensity = getLayoutCanvasDensity(totalItemCount);

  const blockDims = (id: LayoutBlockId, count: number) => {
    const base = positions[id];
    return getResponsiveBlockDimensions(base, count);
  };

  const onPointerDown = (id: LayoutBlockId, event: React.PointerEvent) => {
    event.preventDefault();
    const pos = positions[id];
    const block = blocks.find((b) => b.id === id)!;
    const count = countForBlock(items, block);
    const dims = blockDims(id, count);
    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...pos, ...dims },
      moved: false,
    };
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const drag = dragRef.current;
      const canvas = canvasRef.current;
      if (!drag || !canvas) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;

      const rect = canvas.getBoundingClientRect();
      const deltaX = (dx / rect.width) * 100;
      const deltaY = (dy / rect.height) * 100;

      const nextX = clamp(drag.origin.x + deltaX, 0, 100 - drag.origin.w);
      const nextY = clamp(drag.origin.y + deltaY, 0, 100 - drag.origin.h);
      const stored = positionsRef.current[drag.id];

      onPositionsChange({
        ...positionsRef.current,
        [drag.id]: { ...stored, x: nextX, y: nextY },
      });
    },
    [onPositionsChange],
  );

  const onPointerUp = (id: LayoutBlockId, event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (drag && drag.id === id && !drag.moved) {
      onSelectCategory(selected === id ? "All" : id);
    }
    dragRef.current = null;
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  };

  const renderBlock = (block: LayoutBlock) => {
    const count = countForBlock(items, block);
    const Icon = block.icon;
    const pos = positions[block.id];
    const dims = blockDims(block.id, count);
    const isActive = selected === block.id;
    const isHover = hovered === block.id;

    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        className={`layout-category-block draggable ${blockColorClass[block.id]} ${blockFillClass(count)} ${isActive ? "active" : ""} ${isHover ? "hovered" : ""} ${pulsingBlockId === block.id ? "category-updated" : ""}`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${dims.w}%`,
          height: `${dims.h}%`,
        }}
        onPointerDown={(e) => onPointerDown(block.id, e)}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => onPointerUp(block.id, e)}
        onPointerEnter={() => setHovered(block.id)}
        onPointerLeave={() => setHovered(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectCategory(selected === block.id ? "All" : block.id);
          }
        }}
      >
        <Icon size={18} strokeWidth={1.6} />
        <span className="layout-block-label">{block.label}</span>
        <span className="layout-block-count">{count > 0 ? `${count} ${unitLabel(block, count)}` : "Empty"}</span>
      </div>
    );
  };

  const dragHint = isEmptyBag ? "This bag is empty — choose items to add below." : "Drag sections to rearrange this bag";

  return (
    <div className="packing-layout-wrap" key={activeBag.id}>
      <div className="layout-toolbar" role="toolbar" aria-label="Layout controls">
        <p className="layout-toolbar-hint">{dragHint}</p>
        <button className="layout-reset-btn" type="button" onClick={onResetLayout} aria-label="Reset layout">
          Reset
        </button>
      </div>
      <div className="luggage-shell luggage-shell-unified">
        <div className="suitcase-lid" aria-hidden />
        <div className="suitcase-handle" aria-hidden />
        <div className="suitcase-strap left" aria-hidden />
        <div className="suitcase-strap right" aria-hidden />

        <div
          ref={canvasRef}
          className="suitcase-canvas"
          data-density={canvasDensity}
          onPointerMove={onPointerMove}
          aria-label={`Packing layout for ${activeBag.nickname}`}
        >
          <div className="suitcase-center-crease" aria-hidden />
          <div className="suitcase-pocket left-pocket" aria-hidden />
          <div className="suitcase-pocket right-pocket" aria-hidden />

          {!isEmptyBag && blocks.map(renderBlock)}

          {isEmptyBag && (
            <div className="layout-empty-state">
              <p>Nothing in this bag yet</p>
              <p className="layout-empty-sub">Pull items from your other bags.</p>
              {onChooseItems && (
                <button type="button" className="primary-button layout-empty-btn" onClick={onChooseItems}>
                  Choose items
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
