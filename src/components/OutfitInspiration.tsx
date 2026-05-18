import { CloudRain, Footprints, Layers, Moon, Shirt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { getOutfitDetail, getOutfitTopics, type OutfitTopic, type OutfitTopicId } from "../lib/outfitContent";
import {
  getOutfitFallbackImageUrl,
  getOutfitHeroImageUrl,
  getOutfitImageQuery,
  getOutfitImageUrl,
} from "../lib/outfitImages";
import type { TripForm } from "../types";
import { OutfitDetailModal } from "./OutfitDetailModal";
import { OutfitPhotoCard } from "./OutfitPhotoCard";

interface OutfitInspirationProps {
  trip: TripForm;
}

const topicIcons: Record<OutfitTopicId, LucideIcon> = {
  everyday: Layers,
  shoes: Footprints,
  evening: Moon,
  weather: CloudRain,
};

export function OutfitInspiration({ trip }: OutfitInspirationProps) {
  const city = trip.destination?.split(",")[0]?.trim() || "your destination";
  const topics = getOutfitTopics(trip);
  const [activeTopic, setActiveTopic] = useState<OutfitTopic | null>(null);

  const activeDetail = activeTopic ? getOutfitDetail(trip, activeTopic.id) : null;
  const activeImageUrl = activeTopic ? getOutfitHeroImageUrl(city, activeTopic.id) : undefined;
  const activeImageFallback = activeTopic ? getOutfitFallbackImageUrl(activeTopic.id) : undefined;
  const activeImageAlt = activeTopic ? getOutfitImageQuery(city, activeTopic.id) : undefined;

  return (
    <>
      <article className="outfit-card">
        <div className="outfit-card-intro">
          <p className="eyebrow">Outfit inspiration</p>
          <h2>What people are wearing in {city}</h2>
          <p className="helper-text">Tap a photo for local style tips and packing ideas.</p>
        </div>
        <div className="outfit-grid">
          {topics.map((topic) => {
            const Icon = topicIcons[topic.id] ?? Shirt;
            const imageUrl = getOutfitImageUrl(city, topic.id);
            const alt = getOutfitImageQuery(city, topic.id);
            return (
              <OutfitPhotoCard
                key={`${city}-${topic.id}`}
                imageUrl={imageUrl}
                fallbackImageUrl={getOutfitFallbackImageUrl(topic.id)}
                alt={alt}
                caption={topic.cardTitle}
                gradientKey={topic.gradientKey}
                FallbackIcon={Icon}
                onClick={() => setActiveTopic(topic)}
              />
            );
          })}
        </div>
      </article>
      <OutfitDetailModal
        open={Boolean(activeTopic)}
        detail={activeDetail}
        imageUrl={activeImageUrl}
        fallbackImageUrl={activeImageFallback}
        imageAlt={activeImageAlt}
        gradientKey={activeTopic?.gradientKey}
        onClose={() => setActiveTopic(null)}
      />
    </>
  );
}
