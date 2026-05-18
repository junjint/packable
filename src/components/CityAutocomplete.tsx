import { MapPin } from "lucide-react";
import { useRef, useState } from "react";

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
  hasError?: boolean;
}

const cities = [
  "Barcelona, Spain",
  "Paris, France",
  "New York, United States",
  "Tokyo, Japan",
  "Seoul, South Korea",
  "London, United Kingdom",
  "Mexico City, Mexico",
  "Rome, Italy",
  "Amsterdam, Netherlands",
  "Singapore",
  "Los Angeles, United States",
  "Seattle, United States",
  "Madrid, Spain",
  "Berlin, Germany",
  "Copenhagen, Denmark",
  "Lisbon, Portugal",
  "Miami, United States",
  "Cancun, Mexico",
  "Sydney, Australia",
];

export function CityAutocomplete({ value, onChange, hasError }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(!!value);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : cities;

  const pick = (city: string) => {
    setQuery(city);
    setSelected(true);
    setOpen(false);
    onChange(city);
  };

  const handleInput = (text: string) => {
    setQuery(text);
    setSelected(false);
    setOpen(true);
    if (!text.trim()) onChange("");
  };

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      if (!selected) {
        const exact = cities.find((c) => c.toLowerCase() === query.toLowerCase());
        if (exact) {
          pick(exact);
        } else {
          onChange("");
        }
      }
    }, 180);
  };

  return (
    <div className="city-autocomplete" ref={wrapRef}>
      <span className={`input-with-icon ${hasError ? "" : ""}`}>
        <MapPin size={18} />
        <input
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          placeholder="Search for a city..."
          autoComplete="off"
        />
      </span>
      {open && filtered.length > 0 && (
        <ul className="city-dropdown">
          {filtered.map((city) => (
            <li key={city}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(city)}>
                <MapPin size={14} />
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div className="city-dropdown city-no-results">No matching cities found</div>
      )}
    </div>
  );
}
