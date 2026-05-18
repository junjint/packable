import { useEffect, useState } from "react";

interface SafeImageProps {
  src?: string;
  fallbackSrc?: string;
  lastResortSrc?: string;
  alt: string;
  className?: string;
  fallbackGradient: string;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  fallbackSrc,
  lastResortSrc,
  alt,
  className,
  fallbackGradient,
  fallbackLabel,
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  const showFallback = !currentSrc || failed;

  if (showFallback) {
    return (
      <div
        className={`safe-image-fallback ${className ?? ""}`}
        style={{ background: fallbackGradient }}
        role="img"
        aria-label={alt}
      >
        {fallbackLabel && <span>{fallbackLabel}</span>}
      </div>
    );
  }

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    if (lastResortSrc && currentSrc !== lastResortSrc) {
      setCurrentSrc(lastResortSrc);
      return;
    }
    setFailed(true);
  };

  return <img className={className} src={currentSrc} alt={alt} loading="lazy" onError={handleError} />;
}
