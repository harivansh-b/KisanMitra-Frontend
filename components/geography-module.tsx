'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Filter, Info, CheckCircle2, Users, Building2, Warehouse, Truck, ShieldCheck } from 'lucide-react';
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
  { id: 'usr-4', name: 'Vidarbha Grain Storage Warehouse', role: 'STORAGE', district: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, verification_status: 'VERIFIED', details: '5,000 MT Temperature Controlled Storage' },
  { id: 'usr-5', name: 'Marathwada Express Logistics', role: 'TRANSPORT', district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433, verification_status: 'VERIFIED', details: 'Refrigerated & Fleet Agro Transport' },
  { id: 'usr-6', name: 'Mahagrapes Quality Testing Labs', role: 'QUALITY', district: 'Solapur', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064, verification_status: 'VERIFIED', details: 'Certified Moisture & Quality Grading Center' },
  { id: 'usr-7', name: 'Suresh Deshmukh (Farmer)', role: 'FARMER', district: 'Latur', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604, verification_status: 'VERIFIED', details: 'Soybean & Pulse Producer (18 Acres)' },
  { id: 'usr-8', name: 'Krishna Valley Farmers FPO', role: 'FPO', district: 'Kolhapur', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, verification_status: 'VERIFIED', details: 'Jaggery & Sugarcane Collective' },
];

export function GeographyModule() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<MapUser[]>(DEFAULT_MAHARASHTRA_USERS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [activeUser, setActiveUser] = useState<MapUser | null>(DEFAULT_MAHARASHTRA_USERS[0]);
  const [loading, setLoading] = useState(false);

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

  // Real Leaflet Map Setup with OpenStreetMap Tiles
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet CSS dynamically if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      if (!leafletMapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([19.7515, 75.7139], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);
        leafletMapInstanceRef.current = map;
      }

      const map = leafletMapInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add pins for non-admin Maharashtra users
      users.forEach((usr) => {
        const colorClass = usr.role === 'FARMER' ? '#10b981' : usr.role === 'FPO' ? '#3b82f6' : usr.role === 'BUYER' ? '#f59e0b' : usr.role === 'STORAGE' ? '#a855f7' : usr.role === 'TRANSPORT' ? '#6366f1' : '#f43f5e';
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color:${colorClass}; color:white; padding:4px 8px; border-radius:12px; font-weight:bold; font-size:11px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border:2px solid white; display:flex; items-center; gap:4px;">📍 ${usr.district}</div>`,
          iconSize: [80, 26],
          iconAnchor: [40, 13],
        });

        const marker = L.marker([usr.latitude, usr.longitude], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <strong style="color:${colorClass}; font-size:13px;">${usr.name}</strong><br/>
            <span style="font-size:11px; color:#555;">Role: <b>${usr.role}</b></span><br/>
            <span style="font-size:11px; color:#555;">Location: <b>${usr.district}, Maharashtra</b></span><br/>
            <small style="color:#10b981;">✔ Verified Participant</small>
          </div>
        `);

        marker.on('click', () => {
          setActiveUser(usr);
        });
      });
    });
  }, [users]);

  const roleBadgeColor = (role: string) => {
    switch (role) {
      case 'FARMER': return 'bg-emerald-500 text-white';
      case 'FPO': return 'bg-blue-500 text-white';
      case 'BUYER': return 'bg-amber-500 text-white';
      case 'STORAGE': return 'bg-purple-500 text-white';
      case 'TRANSPORT': return 'bg-indigo-500 text-white';
      case 'QUALITY': return 'bg-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'FARMER': return <Users className="h-4 w-4" />;
      case 'FPO': return <Building2 className="h-4 w-4" />;
      case 'BUYER': return <Building2 className="h-4 w-4" />;
      case 'STORAGE': return <Warehouse className="h-4 w-4" />;
      case 'TRANSPORT': return <Truck className="h-4 w-4" />;
      case 'QUALITY': return <ShieldCheck className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">{t('geo.title')}</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t('geo.subtitle')}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Real OpenStreetMap / Leaflet View · Maharashtra
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('geo.filter_district')}:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              {MAHARASHTRA_DISTRICTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? t('geo.all_districts') : d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t('geo.filter_role')}:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              <option value="All">All Participant Roles</option>
              <option value="FARMER">Farmers</option>
              <option value="FPO">FPO Organizations</option>
              <option value="BUYER">Agri Buyers</option>
              <option value="STORAGE">Storage Facilities</option>
              <option value="TRANSPORT">Transport & Logistics</option>
              <option value="QUALITY">Quality Testing</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">
            Showing {users.length} verified Maharashtra map markers
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Real Interactive Leaflet OpenStreetMap Container */}
        <div className="panel min-h-[440px] p-4 flex flex-col justify-between">
          <div
            ref={mapContainerRef}
            className="w-full h-[400px] rounded-xl border z-0 shadow-inner overflow-hidden"
            aria-label="Real Leaflet Map of Maharashtra"
          />
          <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            {t('geo.admin_note')}
          </p>
        </div>

        {/* Selected Participant Card & Participant List */}
        <div className="space-y-4">
          {activeUser && (
            <div className="panel p-5 border-2 border-primary/40 bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${roleBadgeColor(activeUser.role)}`}>
                    {getRoleIcon(activeUser.role)} {activeUser.role}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{activeUser.name}</h3>
                  <p className="text-xs text-muted-foreground">📍 {activeUser.district}, {activeUser.state}</p>
                </div>
                <span className="rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-xs font-semibold">
                  Verified Participant
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground border-t pt-3">
                {activeUser.details || 'Registered Maharashtra agricultural participant with verified credentials.'}
              </p>
              <div className="mt-3 text-[11px] font-mono text-muted-foreground">
                Lat: {activeUser.latitude.toFixed(4)}, Lon: {activeUser.longitude.toFixed(4)}
              </div>
            </div>
          )}

          <div className="panel overflow-hidden">
            <div className="border-b p-3.5 font-semibold text-sm">
              Participants on Map ({users.length})
            </div>
            <div className="max-h-[260px] divide-y overflow-y-auto">
              {users.map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => setActiveUser(usr)}
                  className={`w-full text-left p-3 text-xs transition-colors hover:bg-muted/50 ${
                    activeUser?.id === usr.id ? 'bg-muted font-medium' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-foreground">{usr.name}</strong>
                    <span className="text-muted-foreground">{usr.district}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-muted-foreground">
                    <span>Role: {usr.role}</span>
                    <span className="text-primary font-semibold">Maharashtra</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
