import { ItemBlock } from "./ItemBlock";
import type { DragEvent } from "react";
import type { Compartment, PackingItem, PackingPlanData } from "../types";

interface ToteVisualizationProps {
  plan: PackingPlanData;
  activeItemId?: string;
  onSelectItem: (item: PackingItem) => void;
  onMoveItem: (id: string, compartment: Compartment) => void;
}

export function ToteVisualization({ plan, activeItemId, onSelectItem, onMoveItem }: ToteVisualizationProps) {
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onMoveItem(id, "main");
  };

  return (
    <div className="tote-shell" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
      <div className="tote-handles" />
      <span className="bag-label">Open compartment</span>
      <div className="soft-bag-items">
        {plan.items.map((item) => <ItemBlock key={item.id} item={item} active={activeItemId === item.id} onSelect={onSelectItem} />)}
      </div>
    </div>
  );
}
