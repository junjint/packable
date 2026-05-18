import type { PackingItem, PackingPlanData } from "../types";

interface SuitcaseSceneProps {
  plan: PackingPlanData;
  activeItemId?: string;
  onSelectItem: (item: PackingItem) => void;
}

export function SuitcaseScene({ plan, activeItemId, onSelectItem }: SuitcaseSceneProps) {
  const left = plan.items.filter((i) => i.compartment === "left");
  const right = plan.items.filter((i) => i.compartment === "right");

  return (
    <div className="flat-suitcase" aria-label="2D suitcase packing layout">
      <div className="flat-half flat-left">
        <span className="flat-label">Left side</span>
        {left.map((item) => (
          <button
            key={item.id}
            className={`flat-item ${item.recommended ? "recommended" : ""} ${activeItemId === item.id ? "active" : ""}`}
            type="button"
            onClick={() => onSelectItem(item)}
          >
            <span>{item.name}</span>
            <small>x{item.quantity}</small>
          </button>
        ))}
        {left.length === 0 && <span className="flat-empty">Empty</span>}
      </div>
      <div className="flat-divider" />
      <div className="flat-half flat-right">
        <span className="flat-label">Right side</span>
        {right.map((item) => (
          <button
            key={item.id}
            className={`flat-item ${item.recommended ? "recommended" : ""} ${activeItemId === item.id ? "active" : ""}`}
            type="button"
            onClick={() => onSelectItem(item)}
          >
            <span>{item.name}</span>
            <small>x{item.quantity}</small>
          </button>
        ))}
        {right.length === 0 && <span className="flat-empty">Empty</span>}
      </div>
    </div>
  );
}
