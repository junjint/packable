import { CalendarDays, Tag } from "lucide-react";
import { useState } from "react";
import { CityAutocomplete } from "./CityAutocomplete";
import { ProgressIndicator } from "./ProgressIndicator";
import type { TripForm } from "../types";

interface PlanTripProps {
  trip: TripForm;
  setTrip: (trip: TripForm) => void;
  onNext: () => void;
}

export function PlanTrip({ trip, setTrip, onNext }: PlanTripProps) {
  const [submitted, setSubmitted] = useState(false);
  const update = (patch: Partial<TripForm>) => setTrip({ ...trip, ...patch });
  const validation = {
    tripName: !trip.tripName.trim(),
    city: !trip.destination.trim(),
    startDate: !trip.startDate,
    endDate: !trip.endDate,
  };
  const hasErrors = validation.tripName || validation.city || validation.startDate || validation.endDate;

  const continueFlow = () => {
    setSubmitted(true);
    if (!hasErrors) onNext();
  };

  return (
    <section className="screen setup-screen">
      <ProgressIndicator step={1} total={3} />
      <div className="screen-header">
        <p className="eyebrow">Smart packing assistant</p>
        <h1>Plan a Trip</h1>
      </div>

      <div className={`question-block ${submitted && validation.tripName ? "field-error" : ""}`}>
        <h2>Trip name <span className="required-dot">Required</span></h2>
        <span className="input-with-icon">
          <Tag size={18} />
          <input value={trip.tripName} onChange={(event) => update({ tripName: event.target.value })} placeholder="e.g. Summer city break" />
        </span>
        {submitted && validation.tripName && <p className="validation-text">Name this trip so it is easy to recognize later.</p>}
      </div>

      <div className={`question-block ${submitted && validation.city ? "field-error" : ""}`}>
        <h2>City <span className="required-dot">Required</span></h2>
        <p className="helper-text">Where are you going? This sets the weather and location context.</p>
        <CityAutocomplete
          value={trip.destination}
          onChange={(city) => update({ destination: city })}
          hasError={submitted && validation.city}
        />
        {submitted && validation.city && <p className="validation-text">Please select a city from the list.</p>}
      </div>

      <div className={`question-block ${submitted && (validation.startDate || validation.endDate) ? "field-error" : ""}`}>
        <h2>Dates <span className="required-dot">Required</span></h2>
        <p className="helper-text">When is your trip?</p>
        <div className="date-grid">
          <span className="input-with-icon">
            <CalendarDays size={18} />
            <input type="date" value={trip.startDate} onChange={(event) => update({ startDate: event.target.value })} />
          </span>
          <span className="input-with-icon">
            <CalendarDays size={18} />
            <input type="date" value={trip.endDate} onChange={(event) => update({ endDate: event.target.value })} />
          </span>
        </div>
        {submitted && (validation.startDate || validation.endDate) && <p className="validation-text">Choose a start and end date.</p>}
      </div>

      <button className="primary-button push-bottom" type="button" onClick={continueFlow}>
        Continue
      </button>
    </section>
  );
}
