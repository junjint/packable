interface ProgressIndicatorProps {
  step: number;
  total?: number;
}

export function ProgressIndicator({ step, total = 2 }: ProgressIndicatorProps) {
  return (
    <div className="progress-bars" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, index) => index + 1).map((bar) => (
        <span key={bar} className={bar <= step ? "active" : ""} />
      ))}
    </div>
  );
}
