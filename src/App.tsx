import { useMemo, useState } from "react";
import { PackingList } from "./components/PackingList";
import { PackingPlan } from "./components/PackingPlan";
import { Personalization } from "./components/Personalization";
import { PlanTrip } from "./components/PlanTrip";
import { TripDetails } from "./components/TripDetails";
import { LoadingScreen } from "./components/LoadingScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { generatePackingPlan, nextSuitcaseSize, reduceNonEssentials, summarizePlan } from "./packingLogic";
import type { Bag, Category, Compartment, PackingItem, PackingPlanData, Screen, SuitcaseSize, TripForm } from "./types";

const mainBag: Bag = {
  id: "bag-main",
  nickname: "Main suitcase",
  containerType: "suitcase",
  suitcase: "small",
  weightLimit: 50,
};

const defaultTrip: TripForm = {
  tripName: "Summer city break",
  destination: "Barcelona",
  startDate: "2026-07-19",
  endDate: "2026-07-26",
  segments: [],
  bags: [mainBag],
  activeBagId: mainBag.id,
  containerType: mainBag.containerType,
  suitcase: mainBag.suitcase,
  weightLimit: mainBag.weightLimit,
  weatherMode: "Auto",
  itineraryUploaded: false,
  airlineLimit: {
    enabled: false,
    airline: "",
    bagType: "Checked bag",
    weightLimit: 50,
  },
  priorities: [],
  activities: [],
  essentialGroups: ["Toiletries", "Electronics", "Travel documents", "Medications"],
  customEssentials: [],
  shoppingSpacePercent: 20,
};

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [trip, setTrip] = useState<TripForm>(defaultTrip);
  const [plan, setPlan] = useState<PackingPlanData>(() => generatePackingPlan(defaultTrip));
  const [savedTrips, setSavedTrips] = useState<TripForm[]>([defaultTrip]);

  const activePlan = useMemo(() => summarizePlan(trip, plan.items, plan.warningDismissed), [plan.items, plan.warningDismissed, trip]);

  const regenerate = (nextTrip = trip) => {
    const nextPlan = generatePackingPlan(nextTrip);
    setPlan(nextPlan);
    setSavedTrips((trips) => {
      const withoutCurrent = trips.filter((stored) => stored.tripName !== nextTrip.tripName);
      return [nextTrip, ...withoutCurrent].slice(0, 4);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setPlan((current) =>
      summarizePlan(
        trip,
        current.items
          .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0),
        current.warningDismissed,
      ),
    );
  };

  const toggleChecked = (id: string) => {
    setPlan((current) =>
      summarizePlan(
        trip,
        current.items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
        current.warningDismissed,
      ),
    );
  };

  const moveItem = (id: string, compartment: Compartment) => {
    setPlan((current) =>
      summarizePlan(
        trip,
        current.items.map((item) => (item.id === id ? { ...item, compartment } : item)),
        current.warningDismissed,
      ),
    );
  };

  const updateItemCategory = (id: string, category: Category) => {
    setPlan((current) =>
      summarizePlan(
        trip,
        current.items.map((item) => (item.id === id ? { ...item, category } : item)),
        current.warningDismissed,
      ),
    );
  };

  const moveItemToBag = (id: string, bagId: string) => {
    setPlan((current) =>
      summarizePlan(
        trip,
        current.items.map((item) => (item.id === id ? { ...item, bagId } : item)),
        current.warningDismissed,
      ),
    );
  };

  const selectBag = (bagId: string) => {
    const bag = trip.bags.find((candidate) => candidate.id === bagId);
    if (!bag) return;
    const nextTrip = {
      ...trip,
      activeBagId: bag.id,
      containerType: bag.containerType,
      suitcase: bag.suitcase,
      weightLimit: bag.weightLimit,
    };
    setTrip(nextTrip);
    setPlan((current) => summarizePlan(nextTrip, current.items, current.warningDismissed));
  };

  const resetItem = (id: string) => {
    setPlan((current) =>
      summarizePlan(
        trip,
        current.items.map((item) => (item.id === id ? { ...item, quantity: item.recommendedQuantity } : item)),
        current.warningDismissed,
      ),
    );
  };

  const removeItem = (id: string) => {
    setPlan((current) => summarizePlan(trip, current.items.filter((item) => item.id !== id), current.warningDismissed));
  };

  const addItem = (item: PackingItem) => {
    setPlan((current) => summarizePlan(trip, [...current.items, item], current.warningDismissed));
  };

  const reduceItems = () => setPlan((current) => reduceNonEssentials(trip, current));

  const switchLuggage = () => {
    const activeBag = trip.bags.find((bag) => bag.id === trip.activeBagId) ?? trip.bags[0];
    const nextSize: SuitcaseSize = nextSuitcaseSize(activeBag?.suitcase ?? trip.suitcase);
    const nextBags = trip.bags.map((bag) => (bag.id === (activeBag?.id ?? trip.activeBagId) ? { ...bag, suitcase: nextSize } : bag));
    const nextTrip = {
      ...trip,
      bags: nextBags,
      suitcase: activeBag?.id === trip.activeBagId ? nextSize : trip.suitcase,
    };
    setTrip(nextTrip);
    setPlan((current) => summarizePlan(nextTrip, current.items, false));
  };

  const addBag = () => {
    const nextBag: Bag = {
      id: `bag-${crypto.randomUUID()}`,
      nickname: trip.bags.length ? `Extra bag ${trip.bags.length + 1}` : "Main bag",
      containerType: "backpack",
      suitcase: "medium",
      weightLimit: 20,
    };
      setTrip((current) => ({
      ...current,
      bags: [...current.bags, nextBag],
      activeBagId: nextBag.id,
      containerType: nextBag.containerType,
      suitcase: nextBag.suitcase,
      weightLimit: nextBag.weightLimit,
    }));
  };

  const dismissWarning = () => {
    setPlan((current) => ({ ...current, warningDismissed: true }));
  };

  const startNewTrip = () => {
    const existingNames = new Set(savedTrips.map((t) => t.tripName));
    let name = "New trip";
    let counter = 1;
    while (existingNames.has(name)) {
      counter++;
      name = `New trip ${counter}`;
    }
    const nextTrip: TripForm = {
      ...defaultTrip,
      tripName: name,
      destination: "",
      activities: [],
      priorities: [],
      segments: [],
      bags: [{ ...mainBag }],
      activeBagId: mainBag.id,
    };
    setTrip(nextTrip);
    setPlan(generatePackingPlan(nextTrip));
    setScreen("setup");
  };

  const combineTrips = () => {
    if (savedTrips.length < 2) {
      window.alert("Save at least two trips to combine packing lists. Add another trip first.");
      return;
    }
    window.alert("Combine trips will merge items from your saved trips into one list. This prototype shortcut is coming soon.");
  };

  const deleteCurrentTrip = () => {
    const confirmed = window.confirm(`Delete "${trip.tripName}"? This cannot be undone.`);
    if (!confirmed) return;

    const remaining = savedTrips.filter((stored) => stored.tripName !== trip.tripName);
    if (remaining.length === 0) {
      setTrip({ ...defaultTrip, tripName: "New trip" });
      setPlan(generatePackingPlan(defaultTrip));
      setSavedTrips([defaultTrip]);
      setScreen("setup");
      return;
    }

    const nextTrip = remaining[0];
    setTrip(nextTrip);
    setPlan(generatePackingPlan(nextTrip));
    setSavedTrips(remaining);
  };

  return (
    <main className="app-shell">
      <div className="phone-frame">
        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("setup")} />}
        {screen === "setup" && <PlanTrip trip={trip} setTrip={setTrip} onNext={() => setScreen("details")} />}
        {screen === "details" && <TripDetails trip={trip} setTrip={setTrip} onEditBasics={() => setScreen("setup")} onNext={() => setScreen("personalization")} />}
        {screen === "personalization" && (
          <Personalization
            trip={trip}
            setTrip={setTrip}
            onBack={() => setScreen("details")}
            onGenerate={() => {
              regenerate();
              setScreen("loading");
            }}
          />
        )}
        {screen === "loading" && <LoadingScreen onComplete={() => setScreen("plan")} />}
        {screen === "plan" && (
          <PackingPlan
            trip={trip}
            plan={activePlan}
            onTripUpdate={(updated) => {
              setTrip(updated);
              setPlan(generatePackingPlan(updated, plan.warningDismissed));
            }}
            onAddTrip={startNewTrip}
            onOpenList={() => setScreen("list")}
            onMoveItemToBag={moveItemToBag}
            onQuantityChange={updateQuantity}
            onToggleChecked={toggleChecked}
            onAddBag={addBag}
            onSelectBag={selectBag}
            onReduceItems={reduceItems}
            onSwitchLuggage={switchLuggage}
            onDismissWarning={dismissWarning}
            onCombineTrips={combineTrips}
            onDeleteTrip={deleteCurrentTrip}
          />
        )}
        {screen === "list" && (
          <PackingList
            trip={trip}
            plan={activePlan}
            onBack={() => setScreen("plan")}
            onQuantityChange={updateQuantity}
            onToggleChecked={toggleChecked}
            onRemove={removeItem}
            onAddItem={addItem}
            onResetItem={resetItem}
            onUpdateItemCategory={updateItemCategory}
            onMoveItemToBag={moveItemToBag}
          />
        )}
      </div>
    </main>
  );
}

export default App;
