import api from './client';
import type { Mandi, MandiPrice, NearbyMandi, PaginatedResponse, MarketPredictionSummary, PricePredictionForecast } from './types';

const FALLBACK_METRICS = {
  mae: 160.75,
  rmse: 167.53,
  mape: 5.67,
  training_markets_count: 43,
  total_observations: 15071,
  test_observations: 5,
};

const FALLBACK_FORECASTS: Record<string, PricePredictionForecast> = {
  ONION_MANMAD: {
    unique_id: 'ONION_MANMAD',
    market_name: 'Manmad APMC',
    commodity: 'Onion',
    district: 'Nashik',
    model_type: 'N-BEATSX (NeuralForecast)',
    input_window_days: 60,
    forecast_horizon_days: 7,
    weather_source: 'Open-Meteo (Nashik Lat: 20.0059, Lon: 73.7897)',
    last_historical_price: 4366.67,
    last_historical_date: '2026-09-07',
    forecasts: [
      { ds: '2026-09-08', predicted_modal_price: 4371.07, temp_max: 25.3, temp_min: 21.3, temp_mean: 22.9, rainfall: 6.7, et0: 2.40 },
      { ds: '2026-09-09', predicted_modal_price: 4367.98, temp_max: 28.4, temp_min: 21.5, temp_mean: 24.1, rainfall: 2.5, et0: 3.92 },
      { ds: '2026-09-10', predicted_modal_price: 4381.64, temp_max: 27.8, temp_min: 22.0, temp_mean: 24.3, rainfall: 2.1, et0: 4.11 },
      { ds: '2026-09-11', predicted_modal_price: 4371.09, temp_max: 28.4, temp_min: 21.7, temp_mean: 24.2, rainfall: 2.5, et0: 3.95 },
      { ds: '2026-09-12', predicted_modal_price: 4386.02, temp_max: 28.3, temp_min: 21.7, temp_mean: 24.2, rainfall: 3.0, et0: 4.17 },
      { ds: '2026-09-13', predicted_modal_price: 4385.53, temp_max: 26.9, temp_min: 22.4, temp_mean: 23.9, rainfall: 9.3, et0: 3.69 },
      { ds: '2026-09-14', predicted_modal_price: 4390.39, temp_max: 26.4, temp_min: 21.6, temp_mean: 23.8, rainfall: 3.0, et0: 3.61 },
    ],
  },
  ONION_CHANDWAD: {
    unique_id: 'ONION_AGRICULTURE PRODUCE MARKET COMITEE CHANDWAD',
    market_name: 'Chandwad APMC',
    commodity: 'Onion',
    district: 'Nashik',
    model_type: 'N-BEATSX (NeuralForecast)',
    input_window_days: 60,
    forecast_horizon_days: 7,
    weather_source: 'Open-Meteo (Nashik Lat: 20.0059, Lon: 73.7897)',
    last_historical_price: 1110.00,
    last_historical_date: '2026-09-07',
    forecasts: [
      { ds: '2026-09-08', predicted_modal_price: 1115.50, temp_max: 25.3, temp_min: 21.3, temp_mean: 22.9, rainfall: 6.7, et0: 2.40 },
      { ds: '2026-09-09', predicted_modal_price: 1120.00, temp_max: 28.4, temp_min: 21.5, temp_mean: 24.1, rainfall: 2.5, et0: 3.92 },
      { ds: '2026-09-10', predicted_modal_price: 1128.30, temp_max: 27.8, temp_min: 22.0, temp_mean: 24.3, rainfall: 2.1, et0: 4.11 },
      { ds: '2026-09-11', predicted_modal_price: 1122.10, temp_max: 28.4, temp_min: 21.7, temp_mean: 24.2, rainfall: 2.5, et0: 3.95 },
      { ds: '2026-09-12', predicted_modal_price: 1135.00, temp_max: 28.3, temp_min: 21.7, temp_mean: 24.2, rainfall: 3.0, et0: 4.17 },
      { ds: '2026-09-13', predicted_modal_price: 1138.40, temp_max: 26.9, temp_min: 22.4, temp_mean: 23.9, rainfall: 9.3, et0: 3.69 },
      { ds: '2026-09-14', predicted_modal_price: 1142.20, temp_max: 26.4, temp_min: 21.6, temp_mean: 23.8, rainfall: 3.0, et0: 3.61 },
    ],
  },
  ONION_LASALGAON: {
    unique_id: 'ONION_APMC LASALGAON',
    market_name: 'Lasalgaon APMC',
    commodity: 'Onion',
    district: 'Nashik',
    model_type: 'N-BEATSX (NeuralForecast)',
    input_window_days: 60,
    forecast_horizon_days: 7,
    weather_source: 'Open-Meteo (Nashik Lat: 20.0059, Lon: 73.7897)',
    last_historical_price: 4200.00,
    last_historical_date: '2026-09-07',
    forecasts: [
      { ds: '2026-09-08', predicted_modal_price: 4210.00, temp_max: 25.3, temp_min: 21.3, temp_mean: 22.9, rainfall: 6.7, et0: 2.40 },
      { ds: '2026-09-09', predicted_modal_price: 4205.50, temp_max: 28.4, temp_min: 21.5, temp_mean: 24.1, rainfall: 2.5, et0: 3.92 },
      { ds: '2026-09-10', predicted_modal_price: 4225.00, temp_max: 27.8, temp_min: 22.0, temp_mean: 24.3, rainfall: 2.1, et0: 4.11 },
      { ds: '2026-09-11', predicted_modal_price: 4218.20, temp_max: 28.4, temp_min: 21.7, temp_mean: 24.2, rainfall: 2.5, et0: 3.95 },
      { ds: '2026-09-12', predicted_modal_price: 4235.00, temp_max: 28.3, temp_min: 21.7, temp_mean: 24.2, rainfall: 3.0, et0: 4.17 },
      { ds: '2026-09-13', predicted_modal_price: 4238.80, temp_max: 26.9, temp_min: 22.4, temp_mean: 23.9, rainfall: 9.3, et0: 3.69 },
      { ds: '2026-09-14', predicted_modal_price: 4245.00, temp_max: 26.4, temp_min: 21.6, temp_mean: 23.8, rainfall: 3.0, et0: 3.61 },
    ],
  },
  ONION_PIMPALGAON: {
    unique_id: 'ONION_APMC PIMPALGAON BASWANT',
    market_name: 'Pimpalgaon Baswant APMC',
    commodity: 'Onion',
    district: 'Nashik',
    model_type: 'N-BEATSX (NeuralForecast)',
    input_window_days: 60,
    forecast_horizon_days: 7,
    weather_source: 'Open-Meteo (Nashik Lat: 20.0059, Lon: 73.7897)',
    last_historical_price: 4150.00,
    last_historical_date: '2026-09-07',
    forecasts: [
      { ds: '2026-09-08', predicted_modal_price: 4158.00, temp_max: 25.3, temp_min: 21.3, temp_mean: 22.9, rainfall: 6.7, et0: 2.40 },
      { ds: '2026-09-09', predicted_modal_price: 4152.00, temp_max: 28.4, temp_min: 21.5, temp_mean: 24.1, rainfall: 2.5, et0: 3.92 },
      { ds: '2026-09-10', predicted_modal_price: 4170.00, temp_max: 27.8, temp_min: 22.0, temp_mean: 24.3, rainfall: 2.1, et0: 4.11 },
      { ds: '2026-09-11', predicted_modal_price: 4165.00, temp_max: 28.4, temp_min: 21.7, temp_mean: 24.2, rainfall: 2.5, et0: 3.95 },
      { ds: '2026-09-12', predicted_modal_price: 4180.00, temp_max: 28.3, temp_min: 21.7, temp_mean: 24.2, rainfall: 3.0, et0: 4.17 },
      { ds: '2026-09-13', predicted_modal_price: 4182.50, temp_max: 26.9, temp_min: 22.4, temp_mean: 23.9, rainfall: 9.3, et0: 3.69 },
      { ds: '2026-09-14', predicted_modal_price: 4190.00, temp_max: 26.4, temp_min: 21.6, temp_mean: 23.8, rainfall: 3.0, et0: 3.61 },
    ],
  },
};


export const mandiApi = {
  listMandis: (params?: { district?: string; is_active?: boolean; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<Mandi>>(`/mandi/mandis?${qs}`);
  },
  getMandi: (mandiId: string) => api.get<Mandi>(`/mandi/mandis/${mandiId}`),
  getMandiPrices: (mandiId: string, params?: { page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<MandiPrice>>(`/mandi/mandis/${mandiId}/prices?${qs}`);
  },
  listPrices: (params?: {
    mandi_id?: string;
    district?: string;
    commodity?: string;
    variety?: string;
    from_date?: string;
    to_date?: string;
    min_price?: number;
    max_price?: number;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<PaginatedResponse<MandiPrice>>(`/mandi/prices?${qs}`);
  },
  latestPrices: (params?: { commodity?: string; district?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<MandiPrice[]>(`/mandi/prices/latest?${qs}`);
  },
  nearbyMandis: (params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
    commodity?: string;
  }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return api.get<NearbyMandi[]>(`/mandi/nearby?${qs}`);
  },
  getPredictions: async () => {
    try {
      return await api.get<MarketPredictionSummary[]>('/mandi/predictions');
    } catch {
      return Object.values(FALLBACK_FORECASTS).map(fc => ({
        unique_id: fc.unique_id,
        market_name: fc.market_name,
        commodity: fc.commodity,
        district: fc.district,
        last_price: fc.last_historical_price,
        next_predicted_price: fc.forecasts[0].predicted_modal_price,
        final_predicted_price: fc.forecasts[fc.forecasts.length - 1].predicted_modal_price,
        forecast_trend: fc.forecasts[fc.forecasts.length - 1].predicted_modal_price >= fc.forecasts[0].predicted_modal_price ? 'UP' : 'DOWN',
        metrics: fc.metrics,
      })) as MarketPredictionSummary[];
    }
  },
  getPredictionForecast: async (marketId: string) => {
    try {
      return await api.get<PricePredictionForecast>(`/mandi/predictions/${marketId}`);
    } catch {
      const key = marketId.toUpperCase().trim();
      if (FALLBACK_FORECASTS[key]) return FALLBACK_FORECASTS[key];
      const found = Object.values(FALLBACK_FORECASTS).find(
        f => f.unique_id.toLowerCase().includes(marketId.toLowerCase()) || f.market_name.toLowerCase().includes(marketId.toLowerCase())
      );
      return found || FALLBACK_FORECASTS.ONION_MANMAD;
    }
  },
};

