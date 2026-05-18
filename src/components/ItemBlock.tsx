import type { PackingItem } from "../types";

interface ItemBlockProps {
  item: PackingItem;
  active: boolean;
  onSelect: (item: PackingItem) => void;
}

export function ItemBlock({ item, active, onSelect }: ItemBlockProps) {
  const Icon = item.icon;

  return (
    <button
      className={`luggage-item ${item.recommended ? "recommended" : ""} ${active ? "active" : ""}`}
      type="button"
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
      onClick={() => onSelect(item)}
    >
      <Icon size={16} />
      <span>{item.name}</span>
      <small>x{item.quantity}</small>
    </button>
  );
}
