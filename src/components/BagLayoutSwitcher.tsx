import type { Bag } from "../types";
import { containerTypeMeta } from "../packingLogic";

interface BagLayoutSwitcherProps {
  bags: Bag[];
  activeBagId: string;
  onSelectBag: (bagId: string) => void;
}

export function BagLayoutSwitcher({ bags, activeBagId, onSelectBag }: BagLayoutSwitcherProps) {
  if (!bags.length) return null;

  return (
    <div className="bag-layout-switcher" role="tablist" aria-label="Select luggage">
      {bags.map((bag) => {
        const isActive = bag.id === activeBagId;
        const typeLabel = containerTypeMeta[bag.containerType]?.label ?? bag.containerType;
        return (
          <button
            key={bag.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`bag-layout-tab ${isActive ? "active" : ""}`}
            onClick={() => onSelectBag(bag.id)}
          >
            <span className="bag-layout-tab-name">{bag.nickname}</span>
            <span className="bag-layout-tab-type">{typeLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
