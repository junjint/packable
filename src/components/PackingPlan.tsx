import { TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CITY_HERO_LAST_RESORT } from "../lib/curatedPhotos";
import { getCityHeroGradient, getCityPhotoFallbackUrl, getCityPhotoUrl } from "../lib/tripImages";
import { getDefaultLayoutPositions, loadLayoutPositions, saveLayoutPositions, type LayoutBlockId, type LayoutPositions } from "../lib/layoutPositions";
import { AddTripModal } from "./AddTripModal";
import { AssignToBagSheet } from "./AssignToBagSheet";
import { ChecklistPreview } from "./ChecklistPreview";
import { EditTripModal } from "./EditTripModal";
import { OutfitInspiration } from "./OutfitInspiration";
import { OverflowMenu } from "./OverflowMenu";
import { BagLayoutSwitcher } from "./BagLayoutSwitcher";
import { getLayoutBlockIdForItem, PackingLayoutView, type LayoutFilter } from "./PackingLayoutView";
import { SafeImage } from "./SafeImage";
import { TutorialTooltip } from "./TutorialTooltip";
import { TripSummary } from "./TripSummary";
import { WarningCard } from "./WarningCard";
import { WeightStatus } from "./WeightStatus";
import type { PackingItem, PackingPlanData, TripForm } from "../types";

interface PackingPlanProps {
  trip: TripForm;
  plan: PackingPlanData;
  onTripUpdate: (trip: TripForm) => void;
  onAddTrip: () => void;
  onOpenList: () => void;
  onMoveItemToBag: (id: string, bagId: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onToggleChecked: (id: string) => void;
  onAddBag: () => void;
  onSelectBag: (bagId: string) => void;
  onReduceItems: () => void;
  onSwitchLuggage: () => void;
  onDismissWarning: () => void;
  onCombineTrips: () => void;
  onDeleteTrip: () => void;
}

export function PackingPlan({
  trip,
  plan,
  onTripUpdate,
  onAddTrip,
  onOpenList,
  onMoveItemToBag,
  onQuantityChange,
  onToggleChecked,
  onAddBag,
  onSelectBag,
  onReduceItems,
  onSwitchLuggage,
  onDismissWarning,
  onCombineTrips,
  onDeleteTrip,
}: PackingPlanProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addTripOpen, setAddTripOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignSheetOpen, setAssignSheetOpen] = useState(false);
  const [layoutFilter, setLayoutFilter] = useState<LayoutFilter>("All");
  const [warningExpanded, setWarningExpanded] = useState(false);
  const [pulsingBlockId, setPulsingBlockId] = useState<LayoutBlockId | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(() => localStorage.getItem("packing-layout-tutorial-dismissed") !== "true");
  const needsWarning = (plan.overweight || plan.overVolume) && !plan.warningDismissed;
  const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId) ?? trip.bags[0];
  const [layoutPositions, setLayoutPositions] = useState<LayoutPositions>(() =>
    loadLayoutPositions(trip.tripName, activeBag.id, activeBag.containerType),
  );

  useEffect(() => {
    setLayoutPositions(loadLayoutPositions(trip.tripName, activeBag.id, activeBag.containerType));
    setLayoutFilter("All");
  }, [trip.tripName, activeBag.id, activeBag.containerType]);

  const handleSelectBag = (bagId: string) => {
    if (bagId === activeBag.id) return;
    saveLayoutPositions(trip.tripName, activeBag.id, layoutPositions);
    onSelectBag(bagId);
  };

  const triggerCategoryPulse = useCallback((blockId: LayoutBlockId | null) => {
    if (!blockId) return;
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    setPulsingBlockId(blockId);
    pulseTimerRef.current = setTimeout(() => setPulsingBlockId(null), 450);
  }, []);

  const pulseForItem = useCallback(
    (item?: PackingItem) => {
      if (!item) return;
      triggerCategoryPulse(getLayoutBlockIdForItem(item));
    },
    [triggerCategoryPulse],
  );

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  const handleLayoutPositionsChange = (positions: LayoutPositions) => {
    setLayoutPositions(positions);
    saveLayoutPositions(trip.tripName, activeBag.id, positions);
  };

  const handleResetLayout = () => {
    const defaults = getDefaultLayoutPositions(activeBag.containerType);
    setLayoutPositions(defaults);
    saveLayoutPositions(trip.tripName, activeBag.id, defaults);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    pulseForItem(plan.items.find((item) => item.id === id));
    onQuantityChange(id, quantity);
  };

  const handleToggleChecked = (id: string) => {
    pulseForItem(plan.items.find((item) => item.id === id));
    onToggleChecked(id);
  };

  const closeTutorial = (dontShowAgain = false) => {
    if (dontShowAgain) localStorage.setItem("packing-layout-tutorial-dismissed", "true");
    setTutorialOpen(false);
  };

  const heroGradient = getCityHeroGradient(trip.destination);
  const cityLabel = trip.destination?.split(",")[0]?.trim() || "Your trip";

  return (
    <section className={`screen plan-screen ${menuOpen || editOpen ? "modal-open" : ""}`}>
      <article className="plan-hero-compact">
        <div className="plan-hero-media">
          <SafeImage
            key={trip.destination}
            src={getCityPhotoUrl(trip.destination)}
            fallbackSrc={getCityPhotoFallbackUrl()}
            lastResortSrc={CITY_HERO_LAST_RESORT}
            alt={`${cityLabel} destination`}
            className="plan-hero-image"
            fallbackGradient={heroGradient}
            fallbackLabel={cityLabel}
          />
          <div className="plan-hero-overlay" />
        </div>
        <div className="plan-hero-content">
          <TripSummary trip={trip} plan={plan} compact />
          <OverflowMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onEditTrip={() => setEditOpen(true)}
            onAddTrip={() => setAddTripOpen(true)}
            onCombineTrips={onCombineTrips}
            onDeleteTrip={onDeleteTrip}
          />
        </div>
      </article>

      <WeightStatus
        trip={trip}
        plan={plan}
        compactWarning
        onWarningClick={() => setWarningExpanded((open) => !open)}
      />

      {warningExpanded && needsWarning && (
        <WarningCard
          plan={plan}
          weightLimit={activeBag.weightLimit}
          onReduceItems={onReduceItems}
          onAddBag={onAddBag}
          onSwitchLuggage={onSwitchLuggage}
          onDismissWarning={onDismissWarning}
        />
      )}

      {plan.warningDismissed && (plan.overweight || plan.overVolume) && (
        <div className="mini-warning">
          <TriangleAlert size={17} />
          Fit warning: {plan.estimatedWeight.toFixed(1)} lbs, {plan.fullnessPercent}% full
        </div>
      )}

      <article className="packing-layout-section packing-layout-primary">
        <BagLayoutSwitcher bags={trip.bags} activeBagId={activeBag.id} onSelectBag={handleSelectBag} />
        <PackingLayoutView
          trip={trip}
          plan={plan}
          selected={layoutFilter}
          positions={layoutPositions}
          onPositionsChange={handleLayoutPositionsChange}
          onSelectCategory={setLayoutFilter}
          onResetLayout={handleResetLayout}
          onChooseItems={() => setAssignSheetOpen(true)}
          pulsingBlockId={pulsingBlockId}
        />
      </article>

      <ChecklistPreview
        plan={plan}
        activeBagId={activeBag.id}
        activeBagName={activeBag.nickname}
        layoutFilter={layoutFilter}
        onShowAll={() => setLayoutFilter("All")}
        onOpenList={onOpenList}
        onChooseItems={() => setAssignSheetOpen(true)}
        onQuantityChange={handleQuantityChange}
        onToggleChecked={handleToggleChecked}
      />

      <OutfitInspiration trip={trip} />

      <EditTripModal
        open={editOpen}
        trip={trip}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => {
          onTripUpdate(updated);
        }}
      />

      <AddTripModal
        open={addTripOpen}
        onClose={() => setAddTripOpen(false)}
        onStartBlank={() => {
          setAddTripOpen(false);
          onAddTrip();
        }}
      />
      <AssignToBagSheet
        open={assignSheetOpen}
        targetBag={activeBag}
        bags={trip.bags}
        items={plan.items}
        onAssign={(itemId) => onMoveItemToBag(itemId, activeBag.id)}
        onClose={() => setAssignSheetOpen(false)}
        onViewFullList={() => {
          setAssignSheetOpen(false);
          onOpenList();
        }}
      />
      <TutorialTooltip open={tutorialOpen} onClose={closeTutorial} />
    </section>
  );
}
