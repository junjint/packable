import { CalendarDays, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CityAutocomplete } from "./CityAutocomplete";
import type { TripForm } from "../types";

interface EditTripModalProps {
  open: boolean;
  trip: TripForm;
  onClose: () => void;
  onSave: (trip: TripForm) => void;
}

export function EditTripModal({ open, trip, onClose, onSave }: EditTripModalProps) {
  const [draft, setDraft] = useState(trip);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(trip);
      setSubmitted(false);
    }
  }, [open, trip]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (patch: Partial<TripForm>) => setDraft({ ...draft, ...patch });
  const invalid = !draft.tripName.trim() || !draft.destination.trim() || !draft.startDate || !draft.endDate;

  const handleSave = () => {
    setSubmitted(true);
    if (invalid) return;
    onSave(draft);
    onClose();
  };

  return createPortal(
    <div className="edit-trip-backdrop modal-layer-edit" role="presentation" onClick={onClose}>
      <div className="edit-trip-modal" role="dialog" aria-modal="true" aria-labelledby="edit-trip-title" onClick={(e) => e.stopPropagation()}>
        <div className="edit-trip-header">
          <h2 id="edit-trip-title">Edit trip details</h2>
          <button className="icon-button quiet" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="edit-trip-body">
          <label className="edit-field">
            <span>Trip name</span>
            <span className="input-with-icon">
              <Tag size={17} />
              <input value={draft.tripName} onChange={(e) => update({ tripName: e.target.value })} />
            </span>
            {submitted && !draft.tripName.trim() && <em className="validation-text">Required</em>}
          </label>

          <label className="edit-field">
            <span>City</span>
            <CityAutocomplete value={draft.destination} onChange={(city) => update({ destination: city })} />
            {submitted && !draft.destination.trim() && <em className="validation-text">Select a city from the list</em>}
          </label>

          <div className="edit-field">
            <span>Dates</span>
            <div className="date-grid">
              <span className="input-with-icon">
                <CalendarDays size={17} />
                <input type="date" value={draft.startDate} onChange={(e) => update({ startDate: e.target.value })} />
              </span>
              <span className="input-with-icon">
                <CalendarDays size={17} />
                <input type="date" value={draft.endDate} onChange={(e) => update({ endDate: e.target.value })} />
              </span>
            </div>
          </div>
        </div>

        <div className="edit-trip-footer">
          <button className="ghost-button edit-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button edit-save" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
