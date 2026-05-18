import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getOutfitGradient } from "../lib/tripImages";

interface OutfitPhotoCardProps {
  imageUrl: string;
  fallbackImageUrl?: string;
  alt: string;
  caption: string;
  gradientKey: string;
  FallbackIcon: LucideIcon;
  onClick: () => void;
}

export function OutfitPhotoCard({
  imageUrl,
  fallbackImageUrl,
  alt,
  caption,
  gradientKey,
  FallbackIcon,
  onClick,
}: OutfitPhotoCardProps) {
  const [src, setSrc] = useState(imageUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(imageUrl);
    setFailed(false);
  }, [imageUrl]);

  const handleError = () => {
    if (fallbackImageUrl && src !== fallbackImageUrl) {
      setSrc(fallbackImageUrl);
      return;
    }
    setFailed(true);
  };

  return (
    <button type="button" className="outfit-tile outfit-tile-button outfit-tile-photo" onClick={onClick}>
      {!failed && (
        <img
          className="outfit-tile-image"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
      )}
      {failed && (
        <div className="outfit-tile-fallback" style={{ background: getOutfitGradient(gradientKey) }} aria-hidden>
          <FallbackIcon size={28} strokeWidth={1.5} />
        </div>
      )}
      <div className="outfit-tile-scrim" aria-hidden />
      <strong className="outfit-tile-caption">{caption}</strong>
    </button>
  );
}
