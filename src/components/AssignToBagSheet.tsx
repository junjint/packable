import { ArrowRight, X } from "lucide-react";
import type { Bag, PackingItem } from "../types";

interface AssignToBagSheetProps {
  open: boolean;
  targetBag: Bag;
  bags: Bag[];
  items: PackingItem[];
  onAssign: (itemId: string) => void;
  onClose: () => void;
  onViewFullList?: () => void;
}

function bagLabel(bags: Bag[], bagId: string): string {
  return bags.find((bag) => bag.id === bagId)?.nickname ?? "Another bag";
}

export function AssignToBagSheet({
  open,
  targetBag,
  bags,
  items,
  onAssign,
  onClose,
  onViewFullList,
}: AssignToBagSheetProps) {
  if (!open) return null;

  const transferable = items
    .filter((item) => item.bagId !== targetBag.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  const hasMultipleBags = bags.length > 1;

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="bottom-sheet assign-bag-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-bag-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-title-row">
          <div>
            <p className="eyebrow">Fill this bag</p>
            <h2 id="assign-bag-title">Add to {targetBag.nickname}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="sheet-copy">
          {hasMultipleBags
            ? "Tap an item to move it from another bag into this one."
            : "Browse your full list to add or edit packing items."}
        </p>

        {transferable.length > 0 ? (
          <ul className="assign-bag-list">
            {transferable.map((item) => (
              <li key={item.id}>
                <button type="button" className="assign-bag-row" onClick={() => onAssign(item.id)}>
                  <span className="assign-bag-row-main">
                    <strong>{item.name}</strong>
                    <small>
                      In {bagLabel(bags, item.bagId)} · {item.category}
                    </small>
                  </span>
                  <span className="assign-bag-row-action">
                    Add
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="assign-bag-empty">
            <p className="helper-text">
              {items.length === 0
                ? "Your packing list is still empty."
                : "Everything is already in this bag."}
            </p>
          </div>
        )}

        {onViewFullList && (
          <button type="button" className="ghost-button assign-bag-full-list" onClick={onViewFullList}>
            View full packing list
          </button>
        )}
        <button type="button" className="text-button assign-bag-done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
