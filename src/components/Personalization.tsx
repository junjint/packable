import { ArrowLeft, Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { getShoppingReservePercent } from "../packingLogic";
import type { EssentialGroup, TripForm } from "../types";

interface PersonalizationProps {
  trip: TripForm;
  setTrip: (trip: TripForm) => void;
  onBack: () => void;
  onGenerate: () => void;
}

const priorities = ["Minimal", "Outfit variety", "Comfort", "Leave extra space"];
const activities = ["Sightseeing", "Beach", "Hiking", "Work", "School", "Formal event", "Nightlife", "Workout", "Dinner", "Laundry access"];
const essentials: EssentialGroup[] = ["Toiletries", "Electronics", "Travel documents", "Medications", "Skincare", "School/work items"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function Personalization({ trip, setTrip, onBack, onGenerate }: PersonalizationProps) {
  const update = (patch: Partial<TripForm>) => setTrip({ ...trip, ...patch });
  const [customEssential, setCustomEssential] = useState("");
  const customList = trip.customEssentials ?? [];
  const shoppingPercent = getShoppingReservePercent(trip);

  const addCustomEssential = () => {
    const trimmed = customEssential.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (customList.some((item) => item.toLowerCase() === lower)) {
      setCustomEssential("");
      return;
    }
    if (essentials.some((group) => group.toLowerCase() === lower)) {
      setCustomEssential("");
      return;
    }
    update({ customEssentials: [...customList, trimmed] });
    setCustomEssential("");
  };

  const removeCustomEssential = (name: string) => {
    update({ customEssentials: customList.filter((item) => item !== name) });
  };

  return (
    <section className="screen">
      <ProgressIndicator step={3} total={3} />
      <button className="icon-button quiet" type="button" onClick={onBack} aria-label="Back">
        <ArrowLeft size={20} />
      </button>
      <div className="screen-header">
        <p className="eyebrow">Packing style</p>
        <h1>Personalization</h1>
      </div>

      <div className="question-block">
        <h2>What do you prioritize when packing?</h2>
        <div className="pill-row">
          {priorities.map((priority) => (
            <button
              key={priority}
              className={`select-pill ${trip.priorities.includes(priority) ? "selected" : ""}`}
              type="button"
              onClick={() => update({ priorities: toggle(trip.priorities, priority) })}
            >
              {trip.priorities.includes(priority) && <Check size={15} />}
              {priority}
            </button>
          ))}
        </div>
      </div>

      <div className="question-block">
        <h2>What activities are you planning?</h2>
        <p className="helper-text">These directly change what gets recommended.</p>
        <div className="pill-row">
          {activities.map((activity) => (
            <button
              key={activity}
              className={`select-pill ${trip.activities.includes(activity) ? "selected" : ""}`}
              type="button"
              onClick={() => update({ activities: toggle(trip.activities, activity) })}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>

      <div className="question-block">
        <h2>Choose your essentials</h2>
        <p className="helper-text">Toggle groups or add custom necessities. Custom items are included in your packing list.</p>
        <div className="pill-row essentials-row">
          {essentials.map((group) => (
            <button
              key={group}
              className={`select-pill ${trip.essentialGroups.includes(group) ? "selected" : ""}`}
              type="button"
              onClick={() => update({ essentialGroups: toggle(trip.essentialGroups, group) as EssentialGroup[] })}
            >
              {trip.essentialGroups.includes(group) && <Check size={15} />}
              {group}
            </button>
          ))}
          {customList.map((name) => (
            <span key={name} className="custom-essential-pill selected">
              <Check size={14} />
              {name}
              <button type="button" className="custom-essential-remove" onClick={() => removeCustomEssential(name)} aria-label={`Remove ${name}`}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="custom-essential-row">
          <input
            value={customEssential}
            onChange={(e) => setCustomEssential(e.target.value)}
            placeholder="e.g. Retainer, inhaler, glasses case"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomEssential();
              }
            }}
          />
          <button className="icon-button" type="button" onClick={addCustomEssential} aria-label="Add custom essential">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="question-block">
        <h2>Extra space for shopping</h2>
        <p className="helper-text">Reserve room for souvenirs and shopping. Essentials are never removed automatically.</p>
        <div className="shopping-slider-wrap">
          <div className="shopping-slider-labels">
            <span>0%</span>
            <strong>Leave {shoppingPercent}% open</strong>
            <span>40%</span>
          </div>
          <input
            type="range"
            className="shopping-slider"
            min={0}
            max={40}
            step={1}
            value={shoppingPercent}
            onChange={(e) => update({ shoppingSpacePercent: Number(e.target.value) })}
            aria-label="Extra space for shopping"
          />
        </div>
      </div>

      <button className="primary-button push-bottom" type="button" onClick={onGenerate}>
        Generate Packing Plan
      </button>
    </section>
  );
}
