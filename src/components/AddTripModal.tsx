import { X } from "lucide-react";

interface AddTripModalProps {
  open: boolean;
  onClose: () => void;
  onStartBlank: () => void;
}

export function AddTripModal({ open, onClose, onStartBlank }: AddTripModalProps) {
  if (!open) return null;

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="add-trip-title" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-title-row">
          <div>
            <p className="eyebrow">Optional</p>
            <h2 id="add-trip-title">Add another trip</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close add trip">
            <X size={18} />
          </button>
        </div>
        <p className="sheet-copy">Create a separate plan when you are testing a second destination or comparing luggage options.</p>
        <button className="primary-button" type="button" onClick={onStartBlank}>Start blank trip</button>
        <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
