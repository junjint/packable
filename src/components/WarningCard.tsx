import { AlertTriangle, Check, Luggage, Wand2 } from "lucide-react";
import type { PackingPlanData } from "../types";

interface WarningCardProps {
  plan: PackingPlanData;
  weightLimit: number;
  onReduceItems: () => void;
  onAddBag: () => void;
  onSwitchLuggage: () => void;
  onDismissWarning: () => void;
}

export function WarningCard({ plan, weightLimit, onReduceItems, onAddBag, onSwitchLuggage, onDismissWarning }: WarningCardProps) {
  const reason = plan.overweight
    ? `Your plan is estimated at ${plan.estimatedWeight.toFixed(1)} lbs, which is over your ${weightLimit} lb limit.`
    : `Your plan uses ${Math.round(plan.totalVolume)} capacity points, which is above this suitcase's comfortable fit.`;
  const spaceUsed = Math.min(100, Math.round((plan.totalVolume / plan.capacity) * 100));

  return (
    <article className="warning-card">
      <div className="warning-title">
        <AlertTriangle size={20} />
        <h2>This may not fit in your selected luggage.</h2>
      </div>
      <p>{reason}</p>
      <div className="warning-metrics">
        <span>{plan.estimatedWeight.toFixed(1)} lbs estimated</span>
        <span>{weightLimit} lbs limit</span>
        <span>{spaceUsed}% space used</span>
      </div>
      <div className="warning-actions">
        <button type="button" onClick={onReduceItems}>
          <Wand2 size={17} />
          Reduce non-essentials
        </button>
        <button type="button" onClick={onSwitchLuggage}>
          <Luggage size={17} />
          Switch to larger bag
        </button>
        <button type="button" onClick={onAddBag}>
          <Luggage size={17} />
          Add another bag
        </button>
        <button type="button" onClick={onDismissWarning}>
          <Check size={17} />
          Keep anyway
        </button>
      </div>
    </article>
  );
}
