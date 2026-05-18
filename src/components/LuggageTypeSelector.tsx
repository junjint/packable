import { Briefcase, Luggage, ShoppingBag, Backpack, BaggageClaim } from "lucide-react";
import { containerTypeMeta } from "../packingLogic";
import type { ContainerType } from "../types";

interface LuggageTypeSelectorProps {
  value: ContainerType;
  onChange: (type: ContainerType) => void;
}

const options: Array<{ type: ContainerType; icon: typeof Luggage }> = [
  { type: "suitcase", icon: Luggage },
  { type: "carry-on", icon: BaggageClaim },
  { type: "duffle", icon: Briefcase },
  { type: "backpack", icon: Backpack },
  { type: "tote", icon: ShoppingBag },
];

export function LuggageTypeSelector({ value, onChange }: LuggageTypeSelectorProps) {
  return (
    <div className="container-type-grid">
      {options.map(({ type, icon: Icon }) => (
        <button
          key={type}
          className={`container-type-card ${value === type ? "selected" : ""}`}
          type="button"
          onClick={() => onChange(type)}
        >
          <Icon size={42} strokeWidth={1.4} />
          <span>{containerTypeMeta[type].label}</span>
          <small>{containerTypeMeta[type].helper}</small>
        </button>
      ))}
    </div>
  );
}
