import { CalendarDays, MapPin, UploadCloud } from "lucide-react";
import { formatDateRange } from "../packingLogic";
import type { TripForm } from "../types";

interface ItineraryUploadCardProps {
  trip: TripForm;
  setTrip: (trip: TripForm) => void;
  compact?: boolean;
}

export function ItineraryUploadCard({ trip, setTrip, compact = false }: ItineraryUploadCardProps) {
  const scan = () => {
    const nextActivities = Array.from(new Set([...trip.activities, "Sightseeing", "Dinner"]));
    setTrip({ ...trip, itineraryUploaded: true, activities: nextActivities });
  };

  if (compact) {
    return (
      <div className="itinerary-auto-row">
        <label className="subtle-upload-button">
          <UploadCloud size={15} />
          {trip.itineraryUploaded ? "Itinerary added" : "Upload itinerary"}
          <input type="file" onChange={scan} />
        </label>
        {(trip.destination || trip.startDate) && (
          <span className="itinerary-context">
            {trip.destination && <><MapPin size={13} /> {trip.destination}</>}
            {trip.startDate && <><CalendarDays size={13} /> {formatDateRange(trip.startDate, trip.endDate)}</>}
          </span>
        )}
      </div>
    );
  }

  return (
    <article className="soft-action-card">
      <div>
        <p className="eyebrow">Optional</p>
        <h3>Have an itinerary?</h3>
        <p>{trip.itineraryUploaded ? "Itinerary scanned. Activities were added to your packing profile." : "Upload itinerary to autofill activities and packing needs."}</p>
      </div>
      <label className="small-file-button">
        <UploadCloud size={17} />
        {trip.itineraryUploaded ? "Scanned" : "Upload itinerary"}
        <input type="file" onChange={scan} />
      </label>
    </article>
  );
}
