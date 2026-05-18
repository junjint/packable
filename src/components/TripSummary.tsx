import { formatDateRange, getTripDays } from "../packingLogic";
import type { PackingPlanData, TripForm } from "../types";

interface TripSummaryProps {
  trip: TripForm;
  plan: PackingPlanData;
  compact?: boolean;
}

export function TripSummary({ trip, plan, compact = false }: TripSummaryProps) {
  const city = trip.destination?.split(",")[0]?.trim() || "Your trip";

  if (compact) {
    return (
      <div className="trip-summary trip-summary-compact">
        <h1>{city}</h1>
        <p>
          {formatDateRange(trip.startDate, trip.endDate)} · {getTripDays(trip)} days
        </p>
        <p className="trip-weather-line">{plan.weatherSummary}</p>
      </div>
    );
  }

  return (
    <div className="trip-summary">
      <p className="eyebrow">Packing plan</p>
      <h1>{trip.destination || "Your trip"}</h1>
      <p>
        {formatDateRange(trip.startDate, trip.endDate)}, {getTripDays(trip)} days
      </p>
      <p>{plan.weatherSummary}</p>
      <p>{plan.seasonSummary}</p>
    </div>
  );
}
