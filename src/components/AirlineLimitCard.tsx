import { Plane } from "lucide-react";
import type { TripForm } from "../types";

interface AirlineLimitCardProps {
  trip: TripForm;
  setTrip: (trip: TripForm) => void;
}

export function AirlineLimitCard({ trip, setTrip }: AirlineLimitCardProps) {
  const update = (patch: Partial<TripForm["airlineLimit"]>) => {
    const airlineLimit = { ...trip.airlineLimit, ...patch };
    const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId);
    const nextBags = activeBag && airlineLimit.enabled
      ? trip.bags.map((bag) => (bag.id === activeBag.id ? { ...bag, weightLimit: airlineLimit.weightLimit } : bag))
      : trip.bags;
    setTrip({ ...trip, airlineLimit, bags: nextBags, weightLimit: airlineLimit.enabled ? airlineLimit.weightLimit : trip.weightLimit });
  };

  return (
    <article className="soft-action-card">
      <div>
        <p className="eyebrow">Optional</p>
        <h3>Are you flying with this bag?</h3>
        <p>Use this to compare your packing plan against your airline’s limit.</p>
      </div>
      <button className={`select-pill ${trip.airlineLimit.enabled ? "selected" : ""}`} type="button" onClick={() => update({ enabled: !trip.airlineLimit.enabled })}>
        <Plane size={16} />
        {trip.airlineLimit.enabled ? "Yes, flying" : "Add airline limit"}
      </button>
      {trip.airlineLimit.enabled && (
        <div className="airline-fields">
          <input value={trip.airlineLimit.airline} onChange={(event) => update({ airline: event.target.value })} placeholder="Airline" />
          <select
            value={trip.airlineLimit.bagType}
            onChange={(event) => {
              const bagType = event.target.value as TripForm["airlineLimit"]["bagType"];
              update({ bagType, weightLimit: bagType === "Checked bag" ? 50 : bagType === "Carry-on" ? 25 : 15 });
            }}
          >
            <option>Checked bag</option>
            <option>Carry-on</option>
            <option>Personal item</option>
          </select>
          <input
            type="number"
            min="1"
            value={trip.airlineLimit.weightLimit}
            onChange={(event) => update({ weightLimit: Math.max(1, Number(event.target.value) || 1) })}
            aria-label="Airline weight limit"
          />
          <p className="helper-text">Weight limit: {trip.airlineLimit.weightLimit} lbs</p>
        </div>
      )}
    </article>
  );
}
