import { Package, Scale, ShoppingBag } from "lucide-react";
import type { PackingPlanData, TripForm } from "../types";
import { getShoppingReservePercent } from "../packingLogic";

interface WeightStatusProps {
  trip: TripForm;
  plan: PackingPlanData;
  compactWarning?: boolean;
  onWarningClick?: () => void;
}

export function WeightStatus({ trip, plan, compactWarning, onWarningClick }: WeightStatusProps) {
  const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId) ?? trip.bags[0];
  const activeSummary = plan.bagSummaries.find((summary) => summary.bagId === activeBag.id) ?? plan.bagSummaries[0];
  const weightLimit = activeSummary?.weightLimit ?? activeBag.weightLimit;
  const shoppingPercent = getShoppingReservePercent(trip);
  const showFitWarning = activeSummary?.overweight || activeSummary?.overVolume;
  const multiBag = trip.bags.length > 1;

  return (
    <div className="packing-status-micro">
      <div className="status-micro-row" aria-label="Packing status">
        <div
          className={`status-micro-chip ${activeSummary?.overweight ? "alert" : ""}`}
          title={`${activeBag.nickname} estimated weight`}
        >
          <Scale size={14} strokeWidth={2} />
          <span>
            {activeSummary?.estimatedWeight.toFixed(0) ?? 0}/{weightLimit} lb
          </span>
        </div>
        <div className={`status-micro-chip ${activeSummary?.overVolume ? "alert" : ""}`} title={`${activeBag.nickname} fullness`}>
          <Package size={14} strokeWidth={2} />
          <span>Full {activeSummary?.fullnessPercent ?? 0}%</span>
        </div>
        <div className="status-micro-chip" title="Reserved shopping space">
          <ShoppingBag size={14} strokeWidth={2} />
          <span>Shop {shoppingPercent}%</span>
        </div>
      </div>
      {multiBag && (
        <p className="status-total-summary">
          Total packed: {plan.totalEstimatedWeight.toFixed(0)} lb across {trip.bags.length} bags
        </p>
      )}
      {compactWarning && showFitWarning && (
        <button type="button" className="fit-warning-pill" onClick={onWarningClick}>
          May not fit
        </button>
      )}
    </div>
  );
}
