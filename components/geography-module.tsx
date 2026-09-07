'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Filter, Info, CheckCircle2, Users, Building2, Warehouse, Truck, ShieldCheck, ChevronDown, ChevronUp, LocateFixed, Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { api } from '@/lib/api/client';

export interface MapUser {
  id: string;
  name: string;
  role: 'FARMER' | 'FPO' | 'BUYER' | 'STORAGE' | 'TRANSPORT' | 'QUALITY' | 'ADMIN';
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  verification_status?: string;
  details?: string;
}

const MAHARASHTRA_DISTRICTS = [
  'All',
  'Pune',
  'Nashik',
  'Mumbai',
  'Nagpur',
  'Chhatrapati Sambhajinagar',
  'Solapur',
  'Kolhapur',
  'Amravati',
  'Latur',
  'Satara',
  'Ahmednagar',
  'Jalgaon',
];

const DEFAULT_MAHARASHTRA_USERS: MapUser[] = [
  { id: 'usr-1', name: 'Ramesh Patil (Farmer)', role: 'FARMER', district: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, verification_status: 'VERIFIED', details: 'Organic Vegetables & Wheat (12 Acres)' },
  { id: 'usr-2', name: 'Sahyadri Agro FPO Co-op', role: 'FPO', district: 'Nashik', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, verification_status: 'VERIFIED', details: '450 Farmer Members · Grapes & Onion Aggregation' },
  { id: 'usr-3', name: 'Maharashtra Mandi Traders Wholesale', role: 'BUYER', district: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, verification_status: 'VERIFIED', details: 'Bulk Procurement & Mandi Wholesaler' },
  { id: 'usr-4', name: 'Vidarbha Grain Storage Warehouse (Storage Manager)', role: 'STORAGE', district: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, verification_status: 'VERIFIED', details: '5,000 MT Temperature Controlled Cold Storage' },
  { id: 'usr-5', name: 'Marathwada Express Logistics (Transport Logistics)', role: 'TRANSPORT', district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433, verification_status: 'VERIFIED', details: 'Refrigerated Fleet Agro Logistics' },
  { id: 'usr-6', name: 'Mahagrapes Quality Testing Labs (Quality Assessor)', role: 'QUALITY', district: 'Solapur', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064, verification_status: 'VERIFIED', details: 'Certified Moisture & Quality Grading Center' },
  { id: 'usr-7', name: 'Suresh Deshmukh (Farmer)', role: 'FARMER', district: 'Latur', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604, verification_status: 'VERIFIED', details: 'Soybean & Pulse Producer (18 Acres)' },
  { id: 'usr-8', name: 'Krishna Valley Farmers FPO', role: 'FPO', district: 'Kolhapur', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, verification_status: 'VERIFIED', details: 'Jaggery & Sugarcane Collective' },
  { id: 'usr-9', name: 'Nashik Fresh Cold Chain Warehouse (Storage Manager)', role: 'STORAGE', district: 'Nashik', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, verification_status: 'VERIFIED', details: '3,500 MT Onion & Grape Pre-cooling Facility' },
  { id: 'usr-10', name: 'Pune Sahyadri Fleet Logistics (Transport Logistics)', role: 'TRANSPORT', district: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, verification_status: 'VERIFIED', details: 'Inter-district Insulated Agro Freight Transport' },
  { id: 'usr-11', name: 'Pune APMC Moisture Assessor Hub (Quality Assessor)', role: 'QUALITY', district: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, verification_status: 'VERIFIED', details: 'Authorized Grain & Vegetable Grading Lab' },
  { id: 'usr-12', name: 'Solapur Cold Storage Solutions (Storage Manager)', role: 'STORAGE', district: 'Solapur', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064, verification_status: 'VERIFIED', details: '2,000 MT Controlled Atmosphere Storage' },
  { id: 'usr-13', name: 'Kolhapur Refrigerated Trucks (Transport Logistics)', role: 'TRANSPORT', district: 'Kolhapur', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, verification_status: 'VERIFIED', details: 'Chilled Milk & Sugarcane Express Fleet' },
  { id: 'usr-14', name: 'Nagpur Citrus & Grain Grading Lab (Quality Assessor)', role: 'QUALITY', district: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, verification_status: 'VERIFIED', details: 'Certified Export & Moisture Assessment Center' },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function GeographyModule() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<MapUser[]>(DEFAULT_MAHARASHTRA_USERS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = All
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [centerLoc, setCenterLoc] = useState<{ lat: number; lng: number }>({ lat: 19.7515, lng: 75.7139 });
  const [activeUser, setActiveUser] = useState<MapUser | null>(DEFAULT_MAHARASHTRA_USERS[0]);
  const [loading, setLoading] = useState(false);
  const [participantLimit, setParticipantLimit] = useState(5);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapInstanceRef = useRef<any>(null);

  useEffect(() => {
    fetchUsers();
  }, [selectedDistrict, selectedRole]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedDistrict !== 'All') params.district = selectedDistrict;
      if (selectedRole !== 'All') params.role = selectedRole;

      const queryStr = new URLSearchParams(params).toString();
      const url = queryStr ? `/directory/map-users?${queryStr}` : '/directory/map-users';
      const res = await api.get<{ users: MapUser[] }>(url);
      if (res && res.users && res.users.length > 0) {
        const filteredNonAdmin = res.users.filter(u => u.role !== 'ADMIN');
        setUsers(filteredNonAdmin);
        if (filteredNonAdmin.length > 0) setActiveUser(filteredNonAdmin[0]);
      }
    } catch {
      let filtered = DEFAULT_MAHARASHTRA_USERS.filter(u => u.role !== 'ADMIN');
      if (selectedDistrict !== 'All') {
        filtered = filtered.filter(u => u.district.toLowerCase() === selectedDistrict.toLowerCase());
      }
      if (selectedRole !== 'All') {
        filtered = filtered.filter(u => u.role === selectedRole);
      }
      setUsers(filtered);
      if (filtered.length > 0) setActiveUser(filtered[0]);
    } finally {
      setLoading(false);
    }
  }

  // Filter users based on user criteria (Role, Verification, Search) and distance criteria (Radius)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (verifiedOnly && u.verification_status !== 'VERIFIED') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = u.name.toLowerCase().includes(q) || u.district.toLowerCase().includes(q) || (u.details && u.details.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (maxDistanceKm > 0) {
        const dist = calculateDistanceKm(centerLoc.lat, centerLoc.lng, u.latitude, u.longitude);
        if (dist > maxDistanceKm) return false;
      }
      return true;
    });
  }, [users, verifiedOnly, searchQuery, maxDistanceKm, centerLoc]);

  // Real Leaflet Map Setup with OpenStreetMap Tiles
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      if (!leafletMapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([centerLoc.lat, centerLoc.lng], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);
        leafletMapInstanceRef.current = map;
      }

      const map = leafletMapInstanceRef.current;
      if (!map) return;

      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      filteredUsers.forEach((usr) => {
        const colorClass = usr.role === 'FARMER' ? '#10b981' : usr.role === 'FPO' ? '#3b82f6' : usr.role === 'BUYER' ? '#f59e0b' : usr.role === 'STORAGE' ? '#a855f7' : usr.role === 'TRANSPORT' ? '#6366f1' : '#f43f5e';
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color:${colorClass}; color:white; padding:4px 8px; border-radius:12px; font-weight:bold; font-size:11px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border:2px solid white; display:flex; items-center; gap:4px;">📍 ${usr.district}</div>`,
          iconSize: [80, 26],
          iconAnchor: [40, 13],
        });

        const marker = L.marker([usr.latitude, usr.longitude], { icon: customIcon }).addTo(map);
        const distFromCenter = calculateDistanceKm(centerLoc.lat, centerLoc.lng, usr.latitude, usr.longitude);
        marker.bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <strong style="color:${colorClass}; font-size:13px;">${usr.name}</strong><br/>
            <span style="font-size:11px; color:#555;">Role: <b>${usr.role}</b></span><br/>
            <span style="font-size:11px; color:#555;">Location: <b>${usr.district}, Maharashtra (${distFromCenter.toFixed(0)} km)</b></span><br/>
            <span style="font-size:10px; color:#777;">${usr.details || ''}</span>
          </div>
        `);
      });
    });
  }, [filteredUsers, centerLoc]);

  const visibleUsersList = useMemo(() => filteredUsers.slice(0, participantLimit), [filteredUsers, participantLimit]);

  function locateMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCenterLoc({ lat: coords.latitude, lng: coords.longitude });
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow">{t('nav.geography')}</p>
            <h2 className="text-2xl font-semibold tracking-tight">{t('geo.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('geo.subtitle')}</p>
          </div>
          <button
            onClick={locateMe}
            className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <LocateFixed className="h-4 w-4 text-emerald-500" />
            {t('mandi.my_location')}
          </button>
        </div>
      </section>

      {/* Advanced User-Based & Distance-Based Filters */}
      <section className="panel p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Filter className="h-4 w-4" />
            <span>User-Based & Distance-Based Filters</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{filteredUsers.length} matching participants</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* User Role Filter */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t('geo.filter_role')}</label>
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setParticipantLimit(5); }}
              className="w-full rounded-md border bg-background px-3 py-2 text-xs"
            >
              <option value="All">All Participant Roles</option>
              <option value="FARMER">{t('role.farmer')}</option>
              <option value="FPO">{t('role.fpo')}</option>
              <option value="BUYER">{t('role.buyer')}</option>
              <option value="STORAGE">{t('role.storage')}</option>
              <option value="TRANSPORT">{t('role.transport')}</option>
              <option value="QUALITY">{t('role.quality')}</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t('geo.filter_district')}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setParticipantLimit(5); }}
              className="w-full rounded-md border bg-background px-3 py-2 text-xs"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? t('geo.all_districts') : d}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Radius Filter */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Proximity Radius Limit</label>
            <select
              value={maxDistanceKm}
              onChange={(e) => { setMaxDistanceKm(Number(e.target.value)); setParticipantLimit(5); }}
              className="w-full rounded-md border bg-background px-3 py-2 text-xs"
            >
              <option value={0}>All Maharashtra State</option>
              <option value={50}>Within 50 km Radius</option>
              <option value={100}>Within 100 km Radius</option>
              <option value={200}>Within 200 km Radius</option>
              <option value={350}>Within 350 km Radius</option>
            </select>
          </div>

          {/* Search Box & Verification Checkbox */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground">Search Participant</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or details..."
                className="w-full rounded-md border bg-background pl-8 pr-3 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="verified-only"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-muted cursor-pointer"
          />
          <label htmlFor="verified-only" className="text-xs font-medium cursor-pointer flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Show KYC Verified Participants Only
          </label>
        </div>
      </section>

      {/* Real Interactive Leaflet Map & Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Real Leaflet Map Container */}
        <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col min-h-[420px]">
          <div className="border-b p-3 bg-muted/30 flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Live Interactive OpenStreetMap (Maharashtra Region)
            </span>
            <span className="text-[11px] text-muted-foreground">Centered: {centerLoc.lat.toFixed(2)}° N, {centerLoc.lng.toFixed(2)}° E</span>
          </div>
          <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0 flex-1" />
        </div>

        {/* Participant Directory Sidebar */}
        <div className="panel p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b pb-2 mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {t('geo.directory_title')}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                {t('listing.showing_limit', { current: visibleUsersList.length, total: filteredUsers.length })}
              </span>
            </div>

            {loading ? (
              <p className="text-xs text-muted-foreground p-4 text-center">Loading network participants...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4 text-center">{t('listing.no_results')}</p>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {visibleUsersList.map((usr) => {
                  const dist = calculateDistanceKm(centerLoc.lat, centerLoc.lng, usr.latitude, usr.longitude);
                  return (
                    <button
                      key={usr.id}
                      onClick={() => setActiveUser(usr)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                        activeUser?.id === usr.id ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="font-semibold text-foreground text-xs flex items-center gap-1">
                          {usr.name}
                          {usr.verification_status === 'VERIFIED' && (
                            <ShieldCheck className="h-3 w-3 text-emerald-500 inline shrink-0" />
                          )}
                        </strong>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">{usr.role}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                        <span>📍 {usr.district}, Maharashtra</span>
                        <span className="font-semibold text-primary">{dist.toFixed(0)} km</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{usr.details}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Show More / Show Less for Participant Directory */}
          {filteredUsers.length > 5 && (
            <div className="pt-2 border-t flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {visibleUsersList.length} / {filteredUsers.length}
              </span>
              {participantLimit < filteredUsers.length ? (
                <button
                  type="button"
                  onClick={() => setParticipantLimit(prev => Math.min(prev + 5, filteredUsers.length))}
                  className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-semibold text-primary hover:bg-muted"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  {t('listing.show_more')} (+5)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setParticipantLimit(5)}
                  className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  {t('listing.show_less')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
