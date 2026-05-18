import { CalendarDays, CloudSun, Edit3, MapPin, Plus, X } from "lucide-react";
import { formatDateRange, getTripDays, getWeatherProfile } from "../packingLogic";
import { AirlineLimitCard } from "./AirlineLimitCard";
import { BagManager } from "./BagManager";
import { ItineraryUploadCard } from "./ItineraryUploadCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { useState } from "react";
import type { Bag, TripForm, TripSegment, WeatherMode } from "../types";

interface TripDetailsProps {
  trip: TripForm;
  setTrip: (trip: TripForm) => void;
  onEditBasics: () => void;
  onNext: () => void;
}

const weatherOptions: WeatherMode[] = ["Auto", "Hot", "Mild", "Cold", "Rainy", "Mixed", "Spring", "Summer", "Fall", "Winter"];

export function TripDetails({ trip, setTrip, onEditBasics, onNext }: TripDetailsProps) {
  const update = (patch: Partial<TripForm>) => setTrip({ ...trip, ...patch });
  const weather = getWeatherProfile(trip);

  const addStop = () => {
    const stop: TripSegment = {
      id: crypto.randomUUID(),
      destination: "",
      startDate: trip.endDate,
      endDate: trip.endDate,
    };
    update({ segments: [...trip.segments, stop] });
  };

  const updateStop = (id: string, patch: Partial<TripSegment>) => {
    update({ segments: trip.segments.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)) });
  };

  const removeStop = (id: string) => {
    update({ segments: trip.segments.filter((stop) => stop.id !== id) });
  };

  const selectBag = (bagId: string) => {
    const bag = trip.bags.find((candidate) => candidate.id === bagId);
    if (!bag) return;
    update({
      activeBagId: bag.id,
      containerType: bag.containerType,
      suitcase: bag.suitcase,
      weightLimit: bag.weightLimit,
    });
  };

  const addBag = () => {
    const bag: Bag = {
      id: `bag-${crypto.randomUUID()}`,
      nickname: `Extra bag ${trip.bags.length + 1}`,
      containerType: "backpack",
      suitcase: "medium",
      weightLimit: 20,
    };
    setTrip({
      ...trip,
      bags: [...trip.bags, bag],
      activeBagId: bag.id,
      containerType: bag.containerType,
      suitcase: bag.suitcase,
      weightLimit: bag.weightLimit,
    });
  };

  const removeBag = (bagId: string) => {
    const nextBags = trip.bags.filter((bag) => bag.id !== bagId);
    const nextActive = nextBags[0];
    if (!nextActive) return;
    setTrip({
      ...trip,
      bags: nextBags,
      activeBagId: nextActive.id,
      containerType: nextActive.containerType,
      suitcase: nextActive.suitcase,
      weightLimit: nextActive.weightLimit,
    });
  };

  const updateBag = (bagId: string, patch: Partial<Bag>) => {
    const nextBags = trip.bags.map((bag) => (bag.id === bagId ? { ...bag, ...patch } : bag));
    const activeBag = nextBags.find((bag) => bag.id === trip.activeBagId) ?? nextBags[0];
    setTrip({
      ...trip,
      bags: nextBags,
      containerType: activeBag.containerType,
      suitcase: activeBag.suitcase,
      weightLimit: activeBag.weightLimit,
    });
  };

  const handleNext = () => {
    onNext();
  };

  const weatherCategories = {
    weather: weatherOptions.filter((o) => ["Auto", "Hot", "Cold", "Rainy", "Mixed", "Mild"].includes(o)),
    season: weatherOptions.filter((o) => ["Spring", "Summer", "Fall", "Winter"].includes(o)),
  };

  return (
    <section className="screen">
      <ProgressIndicator step={2} total={3} />
      <div className="screen-header">
        <p className="eyebrow">Trip setup</p>
        <h1>Trip Details</h1>
      </div>

      <article className="trip-basics-card">
        <div>
          <p className="eyebrow">City</p>
          <h2><MapPin size={18} /> {trip.destination || "Not set"}</h2>
          <span>{formatDateRange(trip.startDate, trip.endDate)}, {getTripDays(trip)} days</span>
        </div>
        <button className="text-button" type="button" onClick={onEditBasics}>
          <Edit3 size={16} />
          Edit
        </button>
      </article>

      <div className="question-block">
        <div className="section-title-row">
          <h2>Stops</h2>
          <button className="subtle-inline-button" type="button" onClick={addStop}>
            <Plus size={15} />
            Visiting another city? Add stop
          </button>
        </div>
        <ItineraryUploadCard trip={trip} setTrip={setTrip} compact />
        {trip.segments.map((stop, index) => (
          <div className="segment-card compact" key={stop.id}>
            <div className="segment-title-row">
              <p>Stop {index + 2}</p>
              <button className="icon-button remove" type="button" onClick={() => removeStop(stop.id)} aria-label="Remove stop">
                <X size={16} />
              </button>
            </div>
            <input value={stop.destination} onChange={(event) => updateStop(stop.id, { destination: event.target.value })} placeholder="City" />
            <div className="date-grid">
              <input type="date" value={stop.startDate} onChange={(event) => updateStop(stop.id, { startDate: event.target.value })} />
              <input type="date" value={stop.endDate} onChange={(event) => updateStop(stop.id, { endDate: event.target.value })} />
            </div>
          </div>
        ))}
      </div>

      <div className="question-block">
        <h2>Weather & season</h2>
        <p className="helper-text">Pick the expected weather or season. Auto uses your city and dates.</p>
        <div className="weather-card">
          <CloudSun size={20} />
          <div>
            <strong>{weather.weatherSummary}</strong>
            <span>{weather.seasonSummary}</span>
          </div>
        </div>
        <div className="weather-tag-section">
          <p className="tag-label">Weather</p>
          <div className="pill-row">
            {weatherCategories.weather.map((option) => (
              <button
                key={option}
                className={`select-pill ${trip.weatherMode === option ? "selected" : ""}`}
                type="button"
                onClick={() => update({ weatherMode: option })}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="weather-tag-section">
          <p className="tag-label">Season</p>
          <div className="pill-row">
            {weatherCategories.season.map((option) => (
              <button
                key={option}
                className={`select-pill ${trip.weatherMode === option ? "selected" : ""}`}
                type="button"
                onClick={() => update({ weatherMode: option })}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AirlineLimitCard trip={trip} setTrip={setTrip} />

      <div className="question-block">
        <h2>Bags <span className="required-dot">Required</span></h2>
        <p className="helper-text">What are you packing in? Add another bag only if you need it.</p>
        <BagManager
          bags={trip.bags}
          activeBagId={trip.activeBagId}
          onSelectBag={selectBag}
          onAddBag={addBag}
          onRemoveBag={removeBag}
          onUpdateBag={updateBag}
        />
      </div>

      <button className="primary-button push-bottom" type="button" onClick={handleNext}>
        Next
      </button>
    </section>
  );
}
