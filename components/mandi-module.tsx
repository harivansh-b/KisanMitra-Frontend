'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, LocateFixed, MapPin, RefreshCw, Search, TrendingUp } from 'lucide-react';
import { mandiApi } from '@/lib/api/mandi';
import { getApiErrorMessage } from '@/lib/api/client';
import type { MandiPrice, NearbyMandi } from '@/lib/api/types';

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const date = (value: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));

export function MandiModule() {
  const [district, setDistrict] = useState('');
  const [mandiId, setMandiId] = useState('');
  const [commodity, setCommodity] = useState('');
  const [variety, setVariety] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>({ latitude: 19.7515, longitude: 75.7139 });
  const [locationMessage, setLocationMessage] = useState('Showing markets around central Maharashtra. Use your location for a more precise view.');

  const mandisQuery = useQuery({ queryKey: ['mandis', district], queryFn: () => mandiApi.listMandis({ district: district || undefined, page_size: 200 }), staleTime: 300_000 });
  const pricesQuery = useQuery({
    queryKey: ['mandi-prices', district, mandiId, commodity, variety, fromDate, toDate],
    queryFn: () => mandiApi.listPrices({ district: district || undefined, mandi_id: mandiId || undefined, commodity: commodity || undefined, variety: variety || undefined, from_date: fromDate || undefined, to_date: toDate || undefined, page_size: 100 }),
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
    }, () => setLocationMessage('Location permission was not granted. You can still browse all markets.'), { timeout: 10_000 });
  }
  const prices = pricesQuery.data?.items ?? [];
  return <div className="space-y-6">
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start"><div><p className="eyebrow">Maharashtra market intelligence</p><h2 className="text-2xl font-semibold tracking-tight">Compare mandi prices with confidence</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Browse market records, filter price arrivals, and see markets close to your farm or collection point.</p></div><button type="button" onClick={() => void pricesQuery.refetch()} className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"><RefreshCw className={pricesQuery.isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />Refresh</button></div>
      <div className="mt-5 flex items-start gap-3 rounded-md border p-3 text-sm text-muted-foreground"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p>Source labels are shown for every record. Seeded data is explicitly marked <strong>AGMARKNET-DEMO</strong>; it is not presented as live official pricing.</p></div>
    </section>
    <section className="panel p-5"><div className="mb-4 flex items-center gap-2"><Search className="h-5 w-5 text-primary" /><h3 className="font-semibold">Filter market prices</h3></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <select aria-label="District" className="rounded-md border bg-background px-3 py-2 text-sm" value={district} onChange={(event) => { setDistrict(event.target.value); setMandiId(''); }}><option value="">All districts</option>{districts.map((name) => <option key={name} value={name}>{name}</option>)}</select>
      <select aria-label="Mandi" className="rounded-md border bg-background px-3 py-2 text-sm" value={mandiId} onChange={(event) => setMandiId(event.target.value)}><option value="">All mandis</option>{(mandisQuery.data?.items ?? []).map((mandi) => <option key={mandi.id} value={mandi.id}>{mandi.name} · {mandi.district}</option>)}</select>
      <select aria-label="Commodity" className="rounded-md border bg-background px-3 py-2 text-sm" value={commodity} onChange={(event) => setCommodity(event.target.value)}><option value="">All commodities</option>{commodities.map((name) => <option key={name} value={name}>{name}</option>)}</select>
      <input aria-label="Variety" className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="Variety" value={variety} onChange={(event) => setVariety(event.target.value)} />
      <input aria-label="From date" className="rounded-md border bg-background px-3 py-2 text-sm" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
      <input aria-label="To date" className="rounded-md border bg-background px-3 py-2 text-sm" type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} />
    </div></section>
    <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b p-4"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><h3 className="font-semibold">Mandi price arrivals</h3></div><span className="text-sm text-muted-foreground">{pricesQuery.data?.total ?? 0} records</span></div>{pricesQuery.isLoading ? <State message="Loading market prices…" loading /> : pricesQuery.isError ? <State message={getApiErrorMessage(pricesQuery.error)} retry={() => void pricesQuery.refetch()} /> : prices.length === 0 ? <State message="No price records match these filters." /> : <PriceTable prices={prices} />}</section>
    <section className="panel p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><h3 className="font-semibold">Nearby markets</h3></div><p className="mt-1 text-sm text-muted-foreground">{locationMessage}</p></div><button type="button" onClick={useMyLocation} className="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"><LocateFixed className="h-4 w-4" />Use my location</button></div><div className="mt-4">{!location ? <State message="Select your current location to search nearby Maharashtra mandis." /> : nearbyQuery.isLoading ? <State message="Finding nearby markets…" loading /> : nearbyQuery.isError ? <State message={getApiErrorMessage(nearbyQuery.error)} retry={() => void nearbyQuery.refetch()} /> : <NearbyMarkets markets={nearbyQuery.data ?? []} />}</div></section>
  </div>;
}

function State({ message, loading = false, retry }: { message: string; loading?: boolean; retry?: () => void }) { return <div className="flex min-h-28 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">{loading ? <RefreshCw className="h-5 w-5 animate-spin text-primary" /> : <AlertCircle className="h-5 w-5" />}<p>{message}</p>{retry && <button type="button" onClick={retry} className="rounded-md border px-3 py-2 font-medium hover:bg-muted">Retry</button>}</div>; }
function PriceTable({ prices }: { prices: MandiPrice[] }) { return <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Commodity</th><th className="px-4 py-3">Variety</th><th className="px-4 py-3">Market</th><th className="px-4 py-3 text-right">Min</th><th className="px-4 py-3 text-right">Modal</th><th className="px-4 py-3 text-right">Max</th><th className="px-4 py-3">Arrival date</th><th className="px-4 py-3">Source</th></tr></thead><tbody className="divide-y">{prices.map((price) => <tr key={price.id} className="hover:bg-muted/30"><td className="px-4 py-3 font-medium">{price.commodity_name}</td><td className="px-4 py-3 text-muted-foreground">{price.variety ?? '—'}</td><td className="px-4 py-3"><span className="font-medium">{price.mandi?.name ?? 'Unknown mandi'}</span><span className="block text-xs text-muted-foreground">{price.mandi?.district ?? '—'}</span></td><td className="px-4 py-3 text-right">{money(price.min_price)}</td><td className="px-4 py-3 text-right font-semibold text-primary">{money(price.modal_price)}</td><td className="px-4 py-3 text-right">{money(price.max_price)}</td><td className="px-4 py-3 text-muted-foreground">{date(price.arrival_date)}</td><td className="px-4 py-3 text-xs text-muted-foreground">{price.source}</td></tr>)}</tbody></table></div>; }
function NearbyMarkets({ markets }: { markets: NearbyMandi[] }) { return markets.length === 0 ? <State message="No active Maharashtra mandi was found within 150 km for these filters." /> : <ul className="divide-y rounded-md border">{markets.map(({ mandi, distance_km }) => <li key={mandi.id} className="flex items-center justify-between gap-3 p-3"><div><p className="font-medium">{mandi.name}</p><p className="text-sm text-muted-foreground">{mandi.district}{mandi.taluk ? ` · ${mandi.taluk}` : ''}</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-sm font-medium">{distance_km.toFixed(1)} km</span></li>)}</ul>; }
