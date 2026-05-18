import { ArrowLeft, Plus, Shirt } from "lucide-react";
import { useMemo, useState } from "react";
import { summarizePlan } from "../packingLogic";
import { ItemRow } from "./ItemRow";
import type { Category, CustomItemDraft, PackingItem, PackingPlanData, TripForm } from "../types";

interface PackingListProps {
  trip: TripForm;
  plan: PackingPlanData;
  onBack: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onToggleChecked: (id: string) => void;
  onRemove: (id: string) => void;
  onAddItem: (item: PackingItem) => void;
  onResetItem: (id: string) => void;
  onUpdateItemCategory: (id: string, category: Category) => void;
  onMoveItemToBag: (id: string, bagId: string) => void;
}

const categories: Category[] = ["Clothing", "Toiletries", "Electronics", "Travel Documents", "Shoes", "Activity Gear", "Weather"];

const emptyDraft: CustomItemDraft = {
  name: "",
  category: "Clothing",
  estimatedWeight: "0.5",
  quantity: "1",
};

export function PackingList({
  trip,
  plan,
  onBack,
  onQuantityChange,
  onToggleChecked,
  onRemove,
  onAddItem,
  onResetItem,
  onUpdateItemCategory,
  onMoveItemToBag,
}: PackingListProps) {
  const [draft, setDraft] = useState<CustomItemDraft>(emptyDraft);
  const livePlan = useMemo(() => summarizePlan(trip, plan.items, plan.warningDismissed), [plan.items, plan.warningDismissed, trip]);
  const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId) ?? trip.bags[0];

  const submitCustomItem = () => {
    const quantity = Math.max(1, Number.parseInt(draft.quantity, 10) || 1);
    const unitWeight = Math.max(0.1, Number.parseFloat(draft.estimatedWeight) || 0.5);
    if (!draft.name.trim()) return;

    onAddItem({
      id: `custom-${crypto.randomUUID()}`,
      name: draft.name.trim(),
      category: draft.category,
      quantity,
      unitWeight,
      unitVolume: Math.max(0.3, unitWeight * 1.4),
      compartment:
        activeBag.containerType === "duffle" || activeBag.containerType === "tote"
          ? "main"
          : activeBag.containerType === "backpack"
            ? draft.category === "Electronics" || draft.category === "Travel Documents" || draft.category === "Toiletries"
              ? "front"
              : "main"
            : draft.category === "Clothing" || draft.category === "Activity Gear" || draft.category === "Weather"
              ? "left"
              : "right",
      icon: Shirt,
      bagId: activeBag.id,
      checked: false,
      optional: true,
      recommendedQuantity: quantity,
      breakdown: "Custom item added during checklist review",
      reason: "Added manually during checklist editing.",
    });
    setDraft(emptyDraft);
  };

  return (
    <section className="screen list-screen">
      <button className="icon-button quiet" type="button" onClick={onBack} aria-label="Back to plan">
        <ArrowLeft size={20} />
      </button>
      <div className="screen-header">
        <p className="eyebrow">{trip.destination || "Trip"}</p>
        <h1>Packing List</h1>
      </div>

      <div className="list-summary">
        <span>{livePlan.items.filter((item) => item.checked).length} packed</span>
        <span>{livePlan.totalEstimatedWeight.toFixed(1)} lbs total</span>
      </div>

      <div className="category-stack">
        {categories.map((category) => {
          const items = livePlan.items.filter((item) => item.category === category);
          if (!items.length) return null;

          return (
            <article className="category-card" key={category}>
              <h2>{category}</h2>
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={onQuantityChange}
                  onToggleChecked={onToggleChecked}
                  onRemove={onRemove}
                  onReset={onResetItem}
                  categories={categories}
                  bags={trip.bags}
                  onCategoryChange={onUpdateItemCategory}
                  onBagChange={onMoveItemToBag}
                />
              ))}
            </article>
          );
        })}
      </div>

      <article className="add-item-card">
        <h2>Add custom item</h2>
        <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Item name" />
        <div className="add-grid">
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.1"
            value={draft.estimatedWeight}
            onChange={(event) => setDraft({ ...draft, estimatedWeight: event.target.value })}
            aria-label="Estimated weight"
          />
          <input
            type="number"
            min="1"
            value={draft.quantity}
            onChange={(event) => setDraft({ ...draft, quantity: event.target.value })}
            aria-label="Quantity"
          />
        </div>
        <button className="primary-button" type="button" onClick={submitCustomItem}>
          <Plus size={18} />
          Add item
        </button>
      </article>
    </section>
  );
}
