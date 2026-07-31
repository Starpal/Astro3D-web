import type { NatalChartFormData } from "@/types/form";
import type { ChartRequestBody } from "@/types/backend";

/**
 * Trasforma i dati raccolti dal form della carta natale
 * nel formato richiesto dal backend per la creazione della carta.
 *
 * Il form usa:
 * - date + time
 * - city
 * - lat + lon
 *
 * Il backend richiede:
 * - dateTime
 * - location.latitude + location.longitude
 * - placeName
 */
export function birthDataToRequest(data: NatalChartFormData): ChartRequestBody {
  const dateTime = `${data.date}T${data.time}:00`;

  return {
    birthData: {
      dateTime,
      timezone: data.timezone,
      location: {
        latitude: data.lat,
        longitude: data.lon,
      },

      placeName: data.city,
    },
    houseSystem: data.houseSystem,
  };
}
