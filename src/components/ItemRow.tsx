import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Bag, Category, PackingItem } from "../types";

interface ItemRowProps {
  item: PackingItem;
  compact?: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onToggleChecked: (id: string) => void;
  onRemove?: (id: string) => void;
  onReset?: (id: string) => void;
  categories?: Category[];
  bags?: Bag[];
  onCategoryChange?: (id: string, category: Category) => void;
  onBagChange?: (id: string, bagId: string) => void;
}

export function ItemRow({
  item,
  compact = false,
  onQuantityChange,
  onToggleChecked,
  onRemove,
  onReset,
  categories = [],
  bags = [],
  onCategoryChange,
  onBagChange,
}: ItemRowProps) {
  const Icon = item.icon;
  const changed = item.quantity !== item.recommendedQuantity;
  const [expanded, setExpanded] = useState(false);
  const canExplain = !compact && (item.reason || item.specificItems?.length);

  return (
    <div className={`item-row-wrap ${item.checked ? "checked" : ""}`}>
      <div className="item-row">
        <button className="check-button" type="button" onClick={() => onToggleChecked(item.id)} aria-label={`Check ${item.name}`}>
          {item.checked ? "✓" : ""}
        </button>
        {!compact && <Icon size={18} />}
        <div className="item-row-main">
          <strong>
            {item.name}
            {item.recommended && !compact && <em>Recommended</em>}
          </strong>
          {!compact && <span>{(item.quantity * item.unitWeight).toFixed(1)} lbs</span>}
        </div>
        <div className="quantity-control">
          <button type="button" onClick={() => onQuantityChange(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}>
            <Minus size={15} />
          </button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => onQuantityChange(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}>
            <Plus size={15} />
          </button>
        </div>
        {canExplain && (
          <button className="why-button" type="button" onClick={() => setExpanded((open) => !open)} aria-label={`Explain ${item.name}`}>
            Why
            <ChevronDown size={14} />
          </button>
        )}
        {onRemove && (
          <button className="icon-button remove" type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
            <Trash2 size={17} />
          </button>
        )}
        {onReset && changed && (
          <button className="reset-row-button" type="button" onClick={() => onReset(item.id)}>
            Reset
          </button>
        )}
      </div>
      {expanded && (
        <div className="item-explanation">
          {item.reason && <p>{item.reason}</p>}
          {item.specificItems?.length ? (
            <ul>
              {item.specificItems.map((specific) => (
                <li key={specific}>{specific}</li>
              ))}
            </ul>
          ) : null}
          {(onCategoryChange || onBagChange) && (
            <div className="item-edit-grid">
              {onCategoryChange && categories.length > 0 && (
                <label>
                  Category
                  <select value={item.category} onChange={(event) => onCategoryChange(item.id, event.target.value as Category)}>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
              )}
              {onBagChange && bags.length > 1 && (
                <label>
                  Bag
                  <select value={item.bagId} onChange={(event) => onBagChange(item.id, event.target.value)}>
                    {bags.map((bag) => (
                      <option key={bag.id} value={bag.id}>{bag.nickname}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
