import React, { useState, useCallback, useRef } from "react";

import type { HouseSystem } from "../../types/backend";
import type { NatalChartFormData } from "../../types/form";
import { HOUSE_SYSTEMS } from "../../constants/chart";

import "./BirthDataForm.css";

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
    if (cleaned.length >= 5)
      cleaned = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    if (cleaned.length >= 8)
      cleaned = cleaned.slice(0, 7) + "-" + cleaned.slice(7);
    setDate(cleaned.slice(0, 10));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleaned = e.target.value.replace(/\D/g, "");
    if (cleaned.length >= 3)
      cleaned = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
    setTime(cleaned.slice(0, 5));
  };

  return (
    <div className="container">
      <form className="contentContainer" onSubmit={handleSubmit}>
        <h1 className="title">Natal Chart</h1>
        <p className="subtitle">Enter your birth details</p>

        {/* Name */}
        <div className="field">
          <label className="label">Name</label>
          <input
            className={errors.name ? "input inputError" : "input"}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Date */}
        <div className="field">
          <label className="label">Birth Date</label>
          <input
            className={errors.date ? "input inputError" : "input"}
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={handleDateChange}
            inputMode="numeric"
            maxLength={10}
            disabled={loading}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        {/* Time */}
        <div className="field">
          <label className="label">Birth Time</label>
          <input
            className={errors.time ? "input inputError" : "input"}
            placeholder="HH:MM"
            value={time}
            onChange={handleTimeChange}
            inputMode="numeric"
            maxLength={5}
            disabled={loading}
          />
          {errors.time && <span className="error">{errors.time}</span>}
        </div>

        {/* City */}
        <div className="field">
          <label className="label">Birth City</label>

          <div className="cityWrapper">
            <input
              className={errors.city ? "input inputError" : "input"}
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

            {loadingCities && <span className="cityLoader">⏳</span>}
          </div>

          {errors.city && <span className="error">{errors.city}</span>}

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((item) => (
                <div
                  key={item.place_id}
                  className="suggestionItem"
                  onClick={() => handleSelectCity(item)}
                >
                  <span className="suggestionText">{item.display_name}</span>
                </div>
              ))}
            </div>
          )}

          {selectedCity && (
            <span className="selectedCity">✓ {selectedCity.display_name}</span>
          )}
        </div>

        {/* House System */}
        <div className="field">
          <label className="label">House System</label>

          <div className="chipsRow">
            {HOUSE_SYSTEMS.map((hs) => {
              const active = hs.value === houseSystem;

              return (
                <button
                  key={hs.value}
                  type="button"
                  className={active ? "chip chipActive" : "chip"}
                  onClick={() => setHouseSystem(hs.value)}
                  disabled={loading}
                >
                  <span
                    className={active ? "chipText chipTextActive" : "chipText"}
                  >
                    {hs.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className={loading ? "button buttonDisabled" : "button"}
          disabled={loading}
        >
          {loading ? "..." : "Calculate Chart →"}
        </button>
      </form>
    </div>
  );
}
