import { GitMerge, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface OverflowMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditTrip: () => void;
  onAddTrip: () => void;
  onCombineTrips: () => void;
  onDeleteTrip: () => void;
}

export function OverflowMenu({ open, onOpenChange, onEditTrip, onAddTrip, onCombineTrips, onDeleteTrip }: OverflowMenuProps) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const close = () => onOpenChange(false);

  const run = (action: () => void) => {
    close();
    action();
  };

  return (
    <>
      <button className="icon-button overflow-trigger plan-menu-trigger" type="button" onClick={() => onOpenChange(true)} aria-label="Trip options">
        <MoreHorizontal size={22} />
      </button>
      {open &&
        createPortal(
          <div className="trip-options-backdrop" role="presentation" onClick={close}>
            <div
              className="trip-options-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="trip-options-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="trip-options-header">
                <h2 id="trip-options-title">Trip options</h2>
                <button type="button" className="icon-button quiet" onClick={close} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="trip-options-list">
                <button className="trip-options-row" type="button" onClick={() => run(onEditTrip)}>
                  <Pencil size={18} />
                  <span>Edit trip details</span>
                </button>
                <button className="trip-options-row" type="button" onClick={() => run(onAddTrip)}>
                  <Plus size={18} />
                  <span>Add another trip</span>
                </button>
                <button className="trip-options-row" type="button" onClick={() => run(onCombineTrips)}>
                  <GitMerge size={18} />
                  <span>Combine trips</span>
                </button>
                <button className="trip-options-row destructive" type="button" onClick={() => run(onDeleteTrip)}>
                  <Trash2 size={18} />
                  <span>Delete trip</span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
