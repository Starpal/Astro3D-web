import.meta.env

import type { NatalChartResponse } from "../types/astrology";
import type { ChartRequestBody } from "../types/backend";
import type { NatalChartFormData } from "../types/form";

import mockChart from "../assets/mock.json";

/**
 * Base URL del backend astro-engine.
 * In locale punta a localhost:3000. In produzione, sposta questo valore
 * in una env var (EXPO_PUBLIC_ASTRO_API_URL su Expo) invece di hardcodarlo.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL?? "http://localhost:3000";

/**
 * Se true, fetchNatalChart restituisce i dati di assets/mock.json
 * invece di chiamare il backend. Utile per testing offline / UI senza server.
 * Impostalo via env var (EXPO_PUBLIC_USE_MOCK=true) o cablando `true` qui sotto.
 */
const USE_MOCK =
  import.meta.env.EXPO_PUBLIC_USE_MOCK === "true" || false;

/** Cast di comodo: il JSON è una NatalChartResponse a tutti gli effetti. */
const MOCK_RESPONSE = mockChart as unknown as NatalChartResponse;

export function birthDataToRequest(
  data: NatalChartFormData,
): ChartRequestBody {
  const dateTime = `${data.date}T${data.time}:00`;
  return {
    birthData: {
      dateTime,
      location: {
        latitude: data.lat,
        longitude: data.lon,
      },
      placeName: data.city,
    },

    houseSystem: data.houseSystem,

    // opzionale per ora
    // zodiac: data.zodiacSystem,
  };
}

export class AstroApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "AstroApiError";
    this.status = status;
  }
}

export async function fetchNatalChart(
  payload: ChartRequestBody,
  signal?: AbortSignal,
): Promise<NatalChartResponse> {
  if (USE_MOCK) {
    // piccolo delay per non vedere il render "istantaneo" durante lo sviluppo
    await new Promise((r) => setTimeout(r, 250));
    // signal.onabort non serve al mock ma lo rispettiamo comunque
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return MOCK_RESPONSE;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/chart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new AstroApiError(
      "Impossibile contattare il server. Controlla la connessione (e che il backend su localhost:3000 sia in esecuzione).",
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AstroApiError(
      text || `Errore del server (status ${res.status})`,
      res.status,
    );
  }

  return (await res.json()) as NatalChartResponse;
}
