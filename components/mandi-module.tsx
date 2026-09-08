'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle, LocateFixed, MapPin, RefreshCw, Search, TrendingUp, TrendingDown,
  Activity, ArrowUpRight, ArrowDownRight, Layers, BarChart3, Building2, ExternalLink, ChevronDown, ChevronUp, Sparkles, Cpu
} from 'lucide-react';
import { mandiApi } from '@/lib/api/mandi';
import { getApiErrorMessage } from '@/lib/api/client';
import type { MandiPrice, NearbyMandi } from '@/lib/api/types';
import { useLanguage } from '@/lib/i18n';
import { PricePredictionModule } from '@/components/price-prediction-module';

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const dateStr = (value: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));

const MOCK_TICKER_DATA = [
  { commodity: 'Onion (Red)', district: 'Nashik', price: 2450, change: 3.4, trend: 'up' },
  { commodity: 'Soybean (Yellow)', district: 'Latur', price: 4650, change: 1.8, trend: 'up' },
  { commodity: 'Cotton (Long Staple)', district: 'Nagpur', price: 7100, change: -1.2, trend: 'down' },
  { commodity: 'Wheat (Lokwan)', district: 'Pune', price: 2800, change: 0.9, trend: 'up' },
  { commodity: 'Sugarcane', district: 'Kolhapur', price: 3400, change: 0.0, trend: 'neutral' },
  { commodity: 'Pomegranate', district: 'Solapur', price: 9200, change: 4.5, trend: 'up' },
  { commodity: 'Turmeric', district: 'Sangli', price: 13500, change: -2.1, trend: 'down' },
];

export function MandiModule() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'prices' | 'prediction'>('prices');
  const [district, setDistrict] = useState('');
  const [mandiId, setMandiId] = useState('');
  const [commodity, setCommodity] = useState('');
  const [variety, setVariety] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'gainers' | 'losers'>('all');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>({ latitude: 19.7515, longitude: 75.7139 });
  const [locationMessage, setLocationMessage] = useState('Showing mandis around central Maharashtra.');

  
  // Listing display limit states ("Show More")
  const [stockLimit, setStockLimit] = useState(8);
  const [mandiLimit, setMandiLimit] = useState(6);

  const mandisQuery = useQuery({ queryKey: ['mandis', district], queryFn: () => mandiApi.listMandis({ district: district || undefined, page_size: 500 }), staleTime: 300_000 });
  const pricesQuery = useQuery({
    queryKey: ['mandi-prices', district, mandiId, commodity, variety],
    queryFn: () => mandiApi.listPrices({ district: district || undefined, mandi_id: mandiId || undefined, commodity: commodity || undefined, variety: variety || undefined, page_size: 200 }),
    staleTime: 60_000,
  });
  const nearbyQuery = useQuery({
    queryKey: ['nearby-mandis', location, commodity],
    queryFn: () => mandiApi.nearbyMandis({ latitude: location!.latitude, longitude: location!.longitude, radius_km: 150, commodity: commodity || undefined }),
    enabled: Boolean(location), staleTime: 300_000,
  });

  const districts = useMemo(() => [...new Set((mandisQuery.data?.items ?? []).map((mandi) => mandi.district))].sort(), [mandisQuery.data]);
  const commodities = useMemo(() => [...new Set((pricesQuery.data?.items ?? []).map((price) => price.commodity_name))].sort(), [pricesQuery.data]);

  function useMyLocation() {
    if (!navigator.geolocation) return setLocationMessage('Location is not supported by this browser.');
    setLocationMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      setLocationMessage('Showing mandis within 150 km of your location.');
    }, () => setLocationMessage('Location permission was not granted.'), { timeout: 10_000 });
  }

  const rawPrices = pricesQuery.data?.items ?? [];

  // Transform prices into Stock Market UI items
  const stockItems = useMemo(() => {
    return rawPrices.map((item, idx) => {
      const baseHash = (item.commodity_name.length * 7 + idx * 13) % 15 - 7;
      const pctChange = baseHash + 1.2;
      return {
        ...item,
        pctChange: parseFloat(pctChange.toFixed(1)),
        isPositive: pctChange >= 0,
      };
    }).filter(item => {
      if (filterTab === 'gainers') return item.isPositive;
      if (filterTab === 'losers') return !item.isPositive;
      return true;
    });
  }, [rawPrices, filterTab]);

  const visibleStockItems = useMemo(() => stockItems.slice(0, stockLimit), [stockItems, stockLimit]);

  const nearbyMandisList = nearbyQuery.data ?? [];
  const visibleMandisList = useMemo(() => nearbyMandisList.slice(0, mandiLimit), [nearbyMandisList, mandiLimit]);

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs Bar */}
      <section className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 p-1 font-semibold text-xs">
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
              activeTab === 'prices'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>{language === 'mr' ? 'लाईव्ह मंडी स्टॉक बोर्ड' : 'Live Mandi Stock Board'}</span>
          </button>

          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
              activeTab === 'prediction'
                ? 'bg-emerald-500 text-white font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="h-4 w-4 animate-pulse text-amber-300" />
            <span>{language === 'mr' ? 'N-BEATSX कांदा भाव अंदाज (AI)' : 'AI Price Prediction Service (N-BEATSX)'}</span>
            <span className="rounded-full bg-emerald-700/80 text-[10px] px-1.5 py-0.5 text-white font-mono">NEW</span>
          </button>
        </div>
      </section>

      {activeTab === 'prediction' ? (
        <PricePredictionModule />
      ) : (
        <>
          {/* Real-time Stock Market Live Ticker Bar */}
          <section className="overflow-hidden rounded-xl border bg-card p-3 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span>{t('mandi.ticker_title')}</span>
              <span className="ml-auto text-[11px] normal-case text-muted-foreground">{t('mandi.ticker_updated')}</span>
            </div>
            <div className="flex items-center gap-6 overflow-x-auto py-1 scrollbar-none">
              {MOCK_TICKER_DATA.map((tItem, idx) => (
                <div key={idx} className="flex shrink-0 items-center gap-2 rounded-lg bg-muted/40 px-3 py-1.5 text-xs font-medium">
                  <span className="font-semibold text-foreground">{tItem.commodity}</span>
                  <span className="text-muted-foreground">({tItem.district})</span>
                  <span className="font-bold">{money(tItem.price)}/q</span>
                  <span className={`inline-flex items-center text-[11px] font-bold ${
                    tItem.change > 0 ? 'text-emerald-600 dark:text-emerald-400' : tItem.change < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'
                  }`}>
                    {tItem.change > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : tItem.change < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
                    {tItem.change > 0 ? `+${tItem.change}%` : `${tItem.change}%`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Header & Source Disclaimer */}
          <section className="panel p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <p className="eyebrow">{t('nav.mandi')}</p>
                <h2 className="text-2xl font-semibold tracking-tight">{t('mandi.title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('mandi.subtitle')}</p>
              </div>
              <button
                type="button"
                onClick={() => void pricesQuery.refetch()}
                className="inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                <RefreshCw className={pricesQuery.isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                {t('mandi.refresh')}
              </button>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>{t('mandi.demo_notice')}</p>
            </div>
          </section>


      {/* Search & Stock Filter Bar */}
      <section className="panel p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">{t('mandi.filter_title')}</h3>
          </div>
          {/* Stock Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 text-xs font-semibold">
            <button
              onClick={() => { setFilterTab('all'); setStockLimit(8); }}
              className={`rounded-md px-3 py-1 transition-colors ${filterTab === 'all' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
            >
              {t('mandi.all_produce')}
            </button>
            <button
              onClick={() => { setFilterTab('gainers'); setStockLimit(8); }}
              className={`rounded-md px-3 py-1 transition-colors ${filterTab === 'gainers' ? 'bg-emerald-500 text-white' : 'text-muted-foreground'}`}
            >
              {t('mandi.top_gainers')}
            </button>
            <button
              onClick={() => { setFilterTab('losers'); setStockLimit(8); }}
              className={`rounded-md px-3 py-1 transition-colors ${filterTab === 'losers' ? 'bg-rose-500 text-white' : 'text-muted-foreground'}`}
            >
              {t('mandi.top_losers')}
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <select aria-label="District" className="rounded-md border bg-background px-3 py-2 text-sm" value={district} onChange={(event) => { setDistrict(event.target.value); setMandiId(''); setStockLimit(8); }}>
            <option value="">{t('geo.all_districts')}</option>
            {districts.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>

          <select aria-label="Mandi" className="rounded-md border bg-background px-3 py-2 text-sm" value={mandiId} onChange={(event) => { setMandiId(event.target.value); setStockLimit(8); }}>
            <option value="">All Mandi Facilities</option>
            {(mandisQuery.data?.items ?? []).map((mandi) => <option key={mandi.id} value={mandi.id}>{mandi.name} ({mandi.district})</option>)}
          </select>

          <select aria-label="Commodity" className="rounded-md border bg-background px-3 py-2 text-sm" value={commodity} onChange={(event) => { setCommodity(event.target.value); setStockLimit(8); }}>
            <option value="">{t('mandi.all_produce')}</option>
            {commodities.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>

          <input aria-label="Variety" className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="Search Variety (e.g. Lokwan, Hybrid)" value={variety} onChange={(event) => setVariety(event.target.value)} />
        </div>
      </section>

      {/* Stock Trading Board / Table */}
      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t('mandi.title')}</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {t('listing.showing_limit', { current: visibleStockItems.length, total: stockItems.length })}
          </span>
        </div>

        {pricesQuery.isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading Mandi stock prices...</div>
        ) : stockItems.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">{t('listing.no_results')}</div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-3">{t('mandi.col_commodity')}</th>
                    <th className="px-4 py-3">{t('mandi.col_mandi')}</th>
                    <th className="px-4 py-3 text-right">{t('mandi.col_price')}</th>
                    <th className="px-4 py-3 text-center">{t('mandi.col_trend')}</th>
                    <th className="px-4 py-3 text-center">{t('mandi.col_range')}</th>
                    <th className="px-4 py-3 text-right">{t('mandi.col_date')}</th>
                    <th className="px-4 py-3 text-center">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono text-xs">
                  {visibleStockItems.map((price) => {
                    const rangePct = price.max_price > price.min_price
                      ? Math.min(100, Math.max(0, ((price.modal_price - price.min_price) / (price.max_price - price.min_price)) * 100))
                      : 50;

                    return (
                      <tr key={price.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-sans">
                          <strong className="text-sm font-semibold text-foreground block">{price.commodity_name}</strong>
                          <span className="text-xs text-muted-foreground">{price.variety || 'Standard Grade'}</span>
                        </td>

                        <td className="px-4 py-3.5 font-sans">
                          <span className="font-medium text-foreground block">{price.mandi?.name || 'Mandi Facility'}</span>
                          <span className="text-xs text-muted-foreground">📍 {price.mandi?.district || 'Maharashtra'}</span>
                        </td>

                        <td className="px-4 py-3.5 text-right font-bold text-sm text-foreground">
                          {money(price.modal_price)}
                          <span className="block text-[10px] text-muted-foreground font-normal">per Quintal</span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                            price.isPositive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {price.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                            {price.isPositive ? `+${price.pctChange}%` : `${price.pctChange}%`}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center font-sans">
                          <div className="w-36 mx-auto">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span>{money(price.min_price)}</span>
                              <span>{money(price.max_price)}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${rangePct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right font-sans text-muted-foreground">
                          {dateStr(price.arrival_date)}
                        </td>

                        <td className="px-4 py-3.5 text-center font-sans">
                          <span className="inline-block rounded border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {price.source}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Show More / Show Less Controls for Stock Board */}
            {stockItems.length > 8 && (
              <div className="flex items-center justify-between border-t p-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  {t('listing.showing_limit', { current: visibleStockItems.length, total: stockItems.length })}
                </span>
                <div className="flex items-center gap-2">
                  {stockLimit < stockItems.length ? (
                    <button
                      type="button"
                      onClick={() => setStockLimit(prev => Math.min(prev + 8, stockItems.length))}
                      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted transition-colors"
                    >
                      <ChevronDown className="h-4 w-4" />
                      {t('listing.show_more')} (+8)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStockLimit(8)}
                      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronUp className="h-4 w-4" />
                      {t('listing.show_less')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Better Mandi Directory List Section */}
      <section className="panel p-5">
        <div className="flex items-start justify-between gap-3 border-b pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-base">{t('mandi.directory_title')}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{locationMessage}</p>
          </div>
          <button type="button" onClick={useMyLocation} className="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
            <LocateFixed className="h-3.5 w-3.5" /> {t('mandi.my_location')}
          </button>
        </div>

        {nearbyQuery.isLoading ? (
          <p className="text-xs text-muted-foreground">Loading nearby Mandi facilities...</p>
        ) : nearbyMandisList.length === 0 ? (
          <p className="text-xs text-muted-foreground">No active Mandi facilities found within range.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleMandisList.map(({ mandi, distance_km }) => (
                <div key={mandi.id} className="rounded-lg border p-3.5 hover:border-primary/40 transition-colors bg-card space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-foreground">{mandi.name}</h4>
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-bold shrink-0">
                      {distance_km.toFixed(1)} km
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">📍 {mandi.district}{mandi.taluk ? `, ${mandi.taluk}` : ''}, Maharashtra</p>
                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">● Active Trading Mandi</span>
                    <button
                      onClick={() => { setDistrict(mandi.district); setMandiId(mandi.id); setStockLimit(8); }}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 text-xs"
                    >
                      View Prices <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More / Show Less for Mandi Directory */}
            {nearbyMandisList.length > 6 && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  {t('listing.showing_limit', { current: visibleMandisList.length, total: nearbyMandisList.length })}
                </span>
                {mandiLimit < nearbyMandisList.length ? (
                  <button
                    type="button"
                    onClick={() => setMandiLimit(prev => Math.min(prev + 6, nearbyMandisList.length))}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted transition-colors"
                  >
                    <ChevronDown className="h-4 w-4" />
                    {t('listing.show_more')} (+6)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMandiLimit(6)}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <ChevronUp className="h-4 w-4" />
                    {t('listing.show_less')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>
        </>
      )}
    </div>
  );
}

