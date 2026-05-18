import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getOutfitGradient } from "../lib/tripImages";
import type { OutfitDetail } from "../lib/outfitContent";

interface OutfitDetailModalProps {
  open: boolean;
  detail: OutfitDetail | null;
  imageUrl?: string;
  fallbackImageUrl?: string;
  imageAlt?: string;
  gradientKey?: string;
  onClose: () => void;
}

export function OutfitDetailModal({
  open,
  detail,
  imageUrl,
  fallbackImageUrl,
  imageAlt,
  gradientKey = "layers",
  onClose,
}: OutfitDetailModalProps) {
  const [heroSrc, setHeroSrc] = useState(imageUrl);
  const [heroFailed, setHeroFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setHeroSrc(imageUrl);
      setHeroFailed(false);
    }
  }, [open, imageUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !detail) return null;

  return createPortal(
    <div className="outfit-detail-backdrop" role="dialog" aria-modal="true" aria-labelledby="outfit-detail-title" onClick={onClose}>
      <div className="outfit-detail-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="outfit-detail-hero">
          {!heroFailed && heroSrc ? (
            <img
              className="outfit-detail-hero-image"
              src={heroSrc}
              alt={imageAlt ?? detail.title}
              onError={() => {
                if (fallbackImageUrl && heroSrc !== fallbackImageUrl) {
                  setHeroSrc(fallbackImageUrl);
                  return;
                }
                setHeroFailed(true);
              }}
            />
          ) : (
            <div className="outfit-detail-hero-fallback" style={{ background: getOutfitGradient(gradientKey) }} aria-hidden />
          )}
          <div className="outfit-detail-hero-scrim" aria-hidden />
          <button type="button" className="outfit-detail-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="outfit-detail-body">
          <h2 id="outfit-detail-title">{detail.title}</h2>
          <p className="outfit-detail-summary">{detail.summary}</p>
          <div className="outfit-detail-section">
            <h3>Practical suggestions</h3>
            <ul>
              {detail.suggestions.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="outfit-detail-section">
            <h3>Related packing items</h3>
            <ul>
              {detail.packItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
