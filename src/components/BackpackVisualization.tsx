import { ItemBlock } from "./ItemBlock";
import type { DragEvent } from "react";
import type { Compartment, PackingItem, PackingPlanData } from "../types";

interface BackpackVisualizationProps {
  plan: PackingPlanData;
  activeItemId?: string;
  onSelectItem: (item: PackingItem) => void;
  onMoveItem: (id: string, compartment: Compartment) => void;
}

const pockets: Array<{ label: string; compartment: Compartment }> = [
  { label: "Top pocket", compartment: "top" },
  { label: "Main pocket", compartment: "main" },
  { label: "Front pocket", compartment: "front" },
];

export function BackpackVisualization({ plan, activeItemId, onSelectItem, onMoveItem }: BackpackVisualizationProps) {
  const drop = (compartment: Compartment) => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onMoveItem(id, compartment);
  };

  return (
    <div className="backpack-shell">
      {pockets.map((pocket) => (
        <div className="backpack-pocket" key={pocket.compartment} onDragOver={(event) => event.preventDefault()} onDrop={drop(pocket.compartment)}>
          <span>{pocket.label}</span>
          {plan.items
            .filter((item) => item.compartment === pocket.compartment || (pocket.compartment === "main" && item.compartment === "left"))
            .map((item) => <ItemBlock key={item.id} item={item} active={activeItemId === item.id} onSelect={onSelectItem} />)}
        </div>
      ))}
    </div>
  );
}
