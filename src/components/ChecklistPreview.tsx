import { ListChecks } from "lucide-react";
import { ItemRow } from "./ItemRow";
import { itemMatchesLayoutFilter, layoutFilterTitles, type LayoutFilter } from "./PackingLayoutView";
import type { PackingPlanData } from "../types";

interface ChecklistPreviewProps {
  plan: PackingPlanData;
  activeBagId: string;
  activeBagName?: string;
  layoutFilter: LayoutFilter;
  onShowAll?: () => void;
  onOpenList: () => void;
  onChooseItems?: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onToggleChecked: (id: string) => void;
}

const importantIds = ["passport", "wallet", "phone-charger", "toothbrush", "toothpaste", "short-sleeve-shirts", "underwear", "walking-shoes"];

export function ChecklistPreview({
  plan,
  activeBagId,
  activeBagName,
  layoutFilter,
  onShowAll,
  onOpenList,
  onChooseItems,
  onQuantityChange,
  onToggleChecked,
}: ChecklistPreviewProps) {
  const bagItems = plan.items.filter((item) => item.bagId === activeBagId);
  const bagIsEmpty = bagItems.length === 0;
  let items = [...bagItems];

  if (layoutFilter === "All") {
    items = items.sort((a, b) => {
      const aRank = importantIds.includes(a.id) ? importantIds.indexOf(a.id) : 99;
      const bRank = importantIds.includes(b.id) ? importantIds.indexOf(b.id) : 99;
      return aRank - bRank;
    });
  } else {
    items = items.filter((item) => itemMatchesLayoutFilter(item, layoutFilter));
  }

  const previewItems = items.slice(0, 8);

  return (
    <article className="checklist-preview checklist-contextual">
      <div className="section-title-row">
        <div className="section-title-copy">
          <p className="eyebrow">Checklist{activeBagName ? ` · ${activeBagName}` : ""}</p>
          <h2>{layoutFilterTitles[layoutFilter]}</h2>
          <p className="helper-text checklist-hint">Tap a section in your bag to view or edit its items.</p>
          {layoutFilter !== "All" && onShowAll && (
            <button type="button" className="text-button subtle-all-link" onClick={onShowAll}>
              All items
            </button>
          )}
        </div>
        <button className="text-button" type="button" onClick={onOpenList}>
          <ListChecks size={17} />
          View full list
        </button>
      </div>

      <div className="preview-list compact-preview-list">
        {bagIsEmpty ? (
          <div className="checklist-empty-bag">
            <p className="helper-text">Nothing packed in this bag yet.</p>
            {onChooseItems && (
              <button type="button" className="ghost-button" onClick={onChooseItems}>
                Choose items from other bags
              </button>
            )}
          </div>
        ) : previewItems.length === 0 ? (
          <p className="helper-text">No items in this section yet.</p>
        ) : (
          previewItems.map((item) => (
            <ItemRow key={item.id} item={item} compact onQuantityChange={onQuantityChange} onToggleChecked={onToggleChecked} />
          ))
        )}
      </div>
    </article>
  );
}
