import { Edit3, Plus, Trash2, X } from "lucide-react";
import { containerTypeMeta, luggageSizeMeta } from "../packingLogic";
import { LuggageTypeSelector } from "./LuggageTypeSelector";
import type { Bag, ContainerType, SuitcaseSize } from "../types";

interface BagManagerProps {
  bags: Bag[];
  activeBagId: string;
  onSelectBag: (bagId: string) => void;
  onAddBag: () => void;
  onRemoveBag: (bagId: string) => void;
  onUpdateBag: (bagId: string, patch: Partial<Bag>) => void;
}

const sizes: SuitcaseSize[] = ["small", "medium", "large"];

export function BagManager({ bags, activeBagId, onSelectBag, onAddBag, onRemoveBag, onUpdateBag }: BagManagerProps) {
  const activeBag = bags.find((bag) => bag.id === activeBagId) ?? bags[0];
  if (!activeBag) return null;
  const sizeMeta = luggageSizeMeta[activeBag.containerType];

  return (
    <div className="bag-manager">
      <div className="bag-tabs" role="tablist" aria-label="Bags">
        {bags.map((bag) => (
          <span key={bag.id} className={`bag-tab-wrap ${bag.id === activeBag.id ? "active" : ""}`}>
            <button className={bag.id === activeBag.id ? "active" : ""} type="button" onClick={() => onSelectBag(bag.id)}>
              {bag.nickname || containerTypeMeta[bag.containerType].label}
            </button>
            {bags.length > 1 && bag.id === activeBag.id && (
              <button className="bag-tab-delete" type="button" onClick={(e) => { e.stopPropagation(); onRemoveBag(bag.id); }} aria-label={`Remove ${bag.nickname}`}>
                <X size={12} />
              </button>
            )}
          </span>
        ))}
        <button className="add-bag-tab" type="button" onClick={onAddBag} aria-label="Add another bag">
          <Plus size={16} />
        </button>
      </div>

      <article className="bag-editor-card">
        <label className="field-label">
          Bag nickname
          <span className="input-with-icon">
            <Edit3 size={17} />
            <input value={activeBag.nickname} onChange={(event) => onUpdateBag(activeBag.id, { nickname: event.target.value })} placeholder="Main suitcase" />
          </span>
        </label>

        <div className="question-block">
          <h3>Bag type</h3>
          <LuggageTypeSelector value={activeBag.containerType} onChange={(containerType: ContainerType) => onUpdateBag(activeBag.id, { containerType })} />
        </div>

        <div className="question-block">
          <h3>Bag size</h3>
          <div className="luggage-options compact-options">
            {sizes.map((size) => (
              <button
                key={size}
                className={`luggage-card ${activeBag.suitcase === size ? "selected" : ""}`}
                type="button"
                onClick={() => onUpdateBag(activeBag.id, { suitcase: size })}
              >
                <span>{sizeMeta[size].label}</span>
                <small>{sizeMeta[size].dimensions}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="question-block">
          <div className="section-title-row">
            <h3>Weight limit</h3>
            <strong className="weight-value">{activeBag.weightLimit} lbs</strong>
          </div>
          <input
            type="range"
            min="5"
            max="105"
            value={activeBag.weightLimit}
            onChange={(event) => onUpdateBag(activeBag.id, { weightLimit: Number(event.target.value) })}
          />
          <input
            className="mini-number-input"
            type="number"
            min="1"
            value={activeBag.weightLimit}
            onChange={(event) => onUpdateBag(activeBag.id, { weightLimit: Math.max(1, Number(event.target.value) || 1) })}
            aria-label="Custom bag weight limit"
          />
        </div>

        {bags.length === 1 && (
          <p className="helper-text helper-text-compact">At least one bag is required.</p>
        )}
      </article>
    </div>
  );
}
