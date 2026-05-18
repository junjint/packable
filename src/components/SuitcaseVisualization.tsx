import { ItemBlock } from "./ItemBlock";
import { SuitcaseScene } from "./SuitcaseScene";
import type { DragEvent } from "react";
import type { Compartment, PackingItem, PackingPlanData } from "../types";

interface SuitcaseVisualizationProps {
  plan: PackingPlanData;
  activeItemId?: string;
  compact?: boolean;
  onSelectItem: (item: PackingItem) => void;
  onMoveItem: (id: string, compartment: Compartment) => void;
}

export function SuitcaseVisualization({ plan, activeItemId, compact = false, onSelectItem, onMoveItem }: SuitcaseVisualizationProps) {
  const left = plan.items.filter((item) => item.compartment === "left");
  const right = plan.items.filter((item) => item.compartment === "right");

  const drop = (compartment: Compartment) => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onMoveItem(id, compartment);
  };

  return (
    <>
      <SuitcaseScene plan={plan} activeItemId={activeItemId} onSelectItem={onSelectItem} />
      <div className="compartment-chip-row">
        <div className="compartment left" onDragOver={(event) => event.preventDefault()} onDrop={drop("left")}>
          <span>Left side</span>
          {left.map((item) => <ItemBlock key={item.id} item={item} active={activeItemId === item.id} onSelect={onSelectItem} />)}
        </div>
        <div className="compartment right" onDragOver={(event) => event.preventDefault()} onDrop={drop("right")}>
          <span>Right side</span>
          {right.map((item) => <ItemBlock key={item.id} item={item} active={activeItemId === item.id} onSelect={onSelectItem} />)}
        </div>
      </div>
    </>
  );
}
