import React, { useState, useCallback, useRef } from "react";
import type { HouseSystem } from "../../types/backend";
import type { NatalChartFormData } from "../../types/form";
import { HOUSE_SYSTEMS } from "../../constants/chart";

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  onSubmit: (data: NatalChartFormData) => void;
  /** true mentre il backend sta calcolando la carta: disabilita il bottone e mostra uno spinner */
  loading?: boolean;
}

export default function BirthDataForm({ onSubmit, loading = false }: Props) {
  const [houseSystem, setHouseSystem] = useState<HouseSystem>("placidus");
  const [name, setName] = useState("Paola");
  const [date, setDate] = useState("1987-12-25");
  const [time, setTime] = useState("23:30");
  const [cityInput, setCityInput] = useState("Vicenza");
  const [timezone, setTimezone] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<LocationResult | null>(null);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 0, lon: 0 });
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchCity = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingCities(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&limit=5&featuretype=city`,
        { headers: { "Accept-Language": "en" } },
      );
      const data: LocationResult[] = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCityInput(text);
    setSelectedCity(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchCity(text);
    }, 300);
  };

  const handleSelectCity = (item: LocationResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    setSelectedCity(item);
    setCityInput(item.display_name.split(",")[0]);
    setSuggestions([]);
    setSelectedCoords({ lat, lon });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = "Format: YYYY-MM-DD";
    if (!/^\d{2}:\d{2}$/.test(time)) e.time = "Format: HH:MM";
    if (!selectedCity) e.city = "Select a city from the list";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name,
      date,
      time,
      city: cityInput,
      lat: selectedCoords.lat,
      lon: selectedCoords.lon,
      houseSystem,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleaned = e.target.value.replace(/\D/g, "");
    if (cleaned.length >= 5) cleaned = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    if (cleaned.length >= 8) cleaned = cleaned.slice(0, 7) + "-" + cleaned.slice(7);
    setDate(cleaned.slice(0, 10));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleaned = e.target.value.replace(/\D/g, "");
    if (cleaned.length >= 3) cleaned = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
    setTime(cleaned.slice(0, 5));
  };

  return (
    <div style={styles.container}>
      <form style={styles.contentContainer} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Natal Chart</h1>
        <p style={styles.subtitle}>Enter your birth details</p>

        {/* Name */}
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input
            style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          {errors.name && <span style={styles.error}>{errors.name}</span>}
        </div>

        {/* Date */}
        <div style={styles.field}>
          <label style={styles.label}>Birth Date</label>
          <input
            style={{ ...styles.input, ...(errors.date ? styles.inputError : {}) }}
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={handleDateChange}
            inputMode="numeric"
            maxLength={10}
            disabled={loading}
          />
          {errors.date && <span style={styles.error}>{errors.date}</span>}
        </div>

        {/* Time */}
        <div style={styles.field}>
          <label style={styles.label}>Birth Time</label>
          <input
            style={{ ...styles.input, ...(errors.time ? styles.inputError : {}) }}
            placeholder="HH:MM"
            value={time}
            onChange={handleTimeChange}
            inputMode="numeric"
            maxLength={5}
            disabled={loading}
          />
          {errors.time && <span style={styles.error}>{errors.time}</span>}
        </div>

        {/* City */}
        <div style={styles.field}>
          <label style={styles.label}>Birth City</label>
          <div style={styles.cityWrapper}>
            <input
              style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }}
              placeholder="Start typing a city..."
              value={cityInput}
              onChange={handleCityChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchCity(cityInput);
                }
              }}
              disabled={loading}
            />
            {loadingCities && <span style={styles.cityLoader}>⏳</span>}
          </div>
          {errors.city && <span style={styles.error}>{errors.city}</span>}
          {suggestions.length > 0 && (
            <div style={styles.suggestions}>
              {suggestions.map((item) => (
                <div
                  key={item.place_id}
                  style={styles.suggestionItem}
                  onClick={() => handleSelectCity(item)}
                >
                  <span style={styles.suggestionText}>{item.display_name}</span>
                </div>
              ))}
            </div>
          )}
          {selectedCity && (
            <span style={styles.selectedCity}>✓ {selectedCity.display_name}</span>
          )}
        </div>

        {/* House System 
         //TODO: create frontend call to pass house system in settings object, aswell as for the aspects orb*/}
        <div style={styles.field}>
          <label style={styles.label}>House System</label>
          <div style={styles.chipsRow}>
            {HOUSE_SYSTEMS.map((hs) => {
              const active = hs.value === houseSystem;
              return (
                <button
                  type="button"
                  key={hs.value}
                  style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
                  onClick={() => setHouseSystem(hs.value)}
                  disabled={loading}
                >
                  <span style={{ ...styles.chipText, ...(active ? styles.chipTextActive : {}) }}>
                    {hs.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          disabled={loading}
        >
          {loading ? "..." : "Calculate Chart →"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    backgroundColor: "#0A0A12",
    minHeight: "100vh",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "40px 24px",
    maxWidth: 480,
    margin: "0 auto",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#E8E0D0",
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    letterSpacing: 1,
    marginBottom: 36,
  },
  field: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 11,
    color: "#C8A96E",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#12121E",
    border: "1px solid #2A2A3E",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#E8E0D0",
    fontSize: 16,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#C0392B",
  },
  error: {
    color: "#C0392B",
    fontSize: 12,
    marginTop: 4,
  },
  cityWrapper: {
    position: "relative",
  },
  cityLoader: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  suggestions: {
    backgroundColor: "#12121E",
    border: "1px solid #2A2A3E",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 180,
    overflowY: "auto",
  },
  suggestionItem: {
    padding: "12px 16px",
    borderBottom: "1px solid #1E1E2E",
    cursor: "pointer",
  },
  suggestionText: {
    color: "#E8E0D0",
    fontSize: 14,
  },
  selectedCity: {
    color: "#C8A96E",
    fontSize: 12,
    marginTop: 6,
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#12121E",
    border: "1px solid #2A2A3E",
    borderRadius: 20,
    padding: "8px 14px",
    cursor: "pointer",
  },
  chipActive: {
    backgroundColor: "#C8A96E",
    borderColor: "#C8A96E",
  },
  chipText: {
    color: "#999",
    fontSize: 13,
  },
  chipTextActive: {
    color: "#0A0A12",
    fontWeight: 700,
  },
  button: {
    backgroundColor: "#C8A96E",
    border: "none",
    borderRadius: 8,
    padding: "16px",
    textAlign: "center",
    marginTop: 12,
    color: "#0A0A12",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 1,
    cursor: "pointer",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};
