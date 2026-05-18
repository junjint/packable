import { X } from "lucide-react";

interface TutorialTooltipProps {
  open: boolean;
  onClose: (dontShowAgain?: boolean) => void;
}

export function TutorialTooltip({ open, onClose }: TutorialTooltipProps) {
  if (!open) return null;

  return (
    <div className="tutorial-popover" role="dialog" aria-label="Packing layout tutorial">
      <button className="icon-button" type="button" onClick={() => onClose()} aria-label="Close tutorial">
        <X size={17} />
      </button>
      <h2>Your packing layout</h2>
      <p>This is a suggested layout based on your trip, luggage type, and weight limit. You can move items or adjust quantities anytime.</p>
      <div className="tutorial-actions">
        <button className="primary-button" type="button" onClick={() => onClose()}>
          Got it
        </button>
        <button className="ghost-button" type="button" onClick={() => onClose(true)}>
          Don’t show again
        </button>
      </div>
    </div>
  );
}
