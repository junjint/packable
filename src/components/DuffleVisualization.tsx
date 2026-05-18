import { ItemBlock } from "./ItemBlock";
import type { DragEvent } from "react";
import type { Compartment, PackingItem, PackingPlanData } from "../types";

interface SoftBagVisualizationProps {
  plan: PackingPlanData;
  activeItemId?: string;
  onSelectItem: (item: PackingItem) => void;
  onMoveItem: (id: string, compartment: Compartment) => void;
}

export function DuffleVisualization({ plan, activeItemId, onSelectItem, onMoveItem }: SoftBagVisualizationProps) {
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onMoveItem(id, "main");
  };

  return (
    <div className="duffle-shell" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
      <span className="bag-label">Main compartment</span>
      <div className="duffle-handle" />
      <div className="soft-bag-items">
        {plan.items.map((item) => <ItemBlock key={item.id} item={item} active={activeItemId === item.id} onSelect={onSelectItem} />)}
      </div>
    </div>
  );
}
