import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const messages = [
  "Checking your trip length...",
  "Estimating weather needs...",
  "Fitting items into your luggage...",
  "Balancing weight and space...",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 850);
    const doneTimer = window.setTimeout(onComplete, 2800);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <section className="screen loading-screen">
      <h1>Calibrating...</h1>
      <div className="spinner" aria-hidden="true" />
      <p>{messages[messageIndex]}</p>
    </section>
  );
}
