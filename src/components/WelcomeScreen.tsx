interface WelcomeScreenProps {
  onStart: () => void;
}

function SuitcaseLogo() {
  return (
    <svg className="welcome-logo" viewBox="0 0 96 96" fill="none" aria-hidden>
      <rect x="18" y="30" width="60" height="44" rx="10" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M34 30V24C34 19.58 37.58 16 42 16H54C58.42 16 62 19.58 62 24V30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="18" y="38" width="60" height="4" fill="currentColor" opacity="0.12" />
      <line x1="48" y1="42" x2="48" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <rect x="40" y="22" width="16" height="6" rx="3" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="screen welcome-screen">
      <div className="welcome-content">
        <SuitcaseLogo />
        <h1 className="welcome-title">Packable</h1>
        <p className="welcome-tagline">Pack smarter for every trip.</p>
      </div>
      <button type="button" className="primary-button welcome-start" onClick={onStart}>
        Start
      </button>
    </section>
  );
}
