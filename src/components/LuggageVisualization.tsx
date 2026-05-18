import { useState } from "react";
import { BackpackVisualization } from "./BackpackVisualization";
import { DuffleVisualization } from "./DuffleVisualization";
import { SuitcaseVisualization } from "./SuitcaseVisualization";
import { ToteVisualization } from "./ToteVisualization";
import type { Category, Compartment, PackingItem, PackingPlanData, TripForm } from "../types";

interface LuggageVisualizationProps {
  trip: TripForm;
  plan: PackingPlanData;
  onMoveItem: (id: string, compartment: Compartment) => void;
  onMoveItemToBag: (id: string, bagId: string) => void;
  onUpdateItemCategory: (id: string, category: Category) => void;
}

const movementOptions: Record<TripForm["containerType"], Array<{ label: string; compartment: Compartment }>> = {
  suitcase: [
    { label: "Move to left side", compartment: "left" },
    { label: "Move to right side", compartment: "right" },
  ],
  "carry-on": [
    { label: "Move to left side", compartment: "left" },
    { label: "Move to right side", compartment: "right" },
  ],
  duffle: [
    { label: "Move to main compartment", compartment: "main" },
    { label: "Move near end pocket", compartment: "front" },
  ],
  backpack: [
    { label: "Move to top pocket", compartment: "top" },
    { label: "Move to main pocket", compartment: "main" },
    { label: "Move to front pocket", compartment: "front" },
  ],
  tote: [
    { label: "Move to open compartment", compartment: "main" },
    { label: "Move near small pocket", compartment: "pocket" },
  ],
};

const allCategories: Category[] = ["Clothing", "Toiletries", "Electronics", "Travel Documents", "Shoes", "Activity Gear", "Weather"];

export function LuggageVisualization({ trip, plan, onMoveItem, onMoveItemToBag, onUpdateItemCategory }: LuggageVisualizationProps) {
  const [activeItem, setActiveItem] = useState<PackingItem | null>(null);
  const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId) ?? trip.bags[0];
  const visiblePlan = {
    ...plan,
    items: plan.items.filter((item) => item.bagId === activeBag.id),
  };

  return (
    <div className="luggage-visual-wrap">
      <div className="suitcase-visual" aria-label="Suitcase packing visualization">
        {(activeBag.containerType === "suitcase" || activeBag.containerType === "carry-on") && (
          <SuitcaseVisualization
            plan={visiblePlan}
            compact={activeBag.containerType === "carry-on"}
            activeItemId={activeItem?.id}
            onSelectItem={setActiveItem}
            onMoveItem={onMoveItem}
          />
        )}
        {activeBag.containerType === "duffle" && <DuffleVisualization plan={visiblePlan} activeItemId={activeItem?.id} onSelectItem={setActiveItem} onMoveItem={onMoveItem} />}
        {activeBag.containerType === "backpack" && (
          <BackpackVisualization plan={visiblePlan} activeItemId={activeItem?.id} onSelectItem={setActiveItem} onMoveItem={onMoveItem} />
        )}
        {activeBag.containerType === "tote" && <ToteVisualization plan={visiblePlan} activeItemId={activeItem?.id} onSelectItem={setActiveItem} onMoveItem={onMoveItem} />}
      </div>

      {activeItem && (
        <article className="item-tooltip">
          <strong>{activeItem.category}</strong>
          <p>
            {activeItem.quantity} {activeItem.name.toLowerCase()}
          </p>
          <span>{activeItem.breakdown}</span>
          <small>Estimated weight: {(activeItem.quantity * activeItem.unitWeight).toFixed(1)} lbs</small>
          <div className="move-actions">
            {movementOptions[activeBag.containerType].map((option) => (
              <button
                key={option.compartment}
                type="button"
                onClick={() => {
                  onMoveItem(activeItem.id, option.compartment);
                  setActiveItem({ ...activeItem, compartment: option.compartment });
                }}
              >
                {option.label}
              </button>
            ))}
            {allCategories
              .filter((cat) => cat !== activeItem.category)
              .map((cat) => (
                <button key={cat} type="button" onClick={() => onUpdateItemCategory(activeItem.id, cat)}>
                  Move to {cat.toLowerCase()}
                </button>
              ))}
            {trip.bags.length > 1 &&
              trip.bags
                .filter((bag) => bag.id !== activeItem.bagId)
                .map((bag) => (
                  <button key={bag.id} type="button" onClick={() => onMoveItemToBag(activeItem.id, bag.id)}>
                    Move to {bag.nickname}
                  </button>
                ))}
          </div>
        </article>
      )}
    </div>
  );
}
