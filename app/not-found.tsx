'use client';

import Link from 'next/link';
import { Leaf, Home, Store, MapPin, FileCheck, Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function NotFound() {
  const [query, setQuery] = useState('');

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 text-primary font-bold text-xl">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Leaf className="h-6 w-6" />
          </div>
          <span>KisanMitra Trade Platform</span>
        </div>

        {/* 404 Visual Badge */}
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Error 404 · Page Not Found / ४०४ पृष्ठ सापडले नाही
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Workspace or Route Unavailable
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The page or workspace section you requested could not be located. It may have moved, or you may be viewing an unmapped location.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search produce, mandis, or district networks..."
            className="w-full rounded-xl border bg-muted/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Helpful Quick Navigation Links */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Quick Navigation Links / जलद नेव्हिगेशन
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs font-semibold">
            <Link
              href="/farmer/overview"
              className="flex items-center justify-center gap-2 rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Home className="h-4 w-4 text-emerald-500" />
              <span>Farmer Overview</span>
            </Link>

            <Link
              href="/farmer/mandi"
              className="flex items-center justify-center gap-2 rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Store className="h-4 w-4 text-blue-500" />
              <span>Mandi Stock Board</span>
            </Link>

            <Link
              href="/farmer/geography"
              className="flex items-center justify-center gap-2 rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>Maharashtra Map</span>
            </Link>

            <Link
              href="/farmer/documents"
              className="flex items-center justify-center gap-2 rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <FileCheck className="h-4 w-4 text-purple-500" />
              <span>Document Center</span>
            </Link>

            <Link
              href="/fpo/overview"
              className="flex items-center justify-center gap-2 rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Home className="h-4 w-4 text-indigo-500" />
              <span>FPO Hub</span>
            </Link>

            <Link
              href="/buyer/overview"
              className="flex items-center justify-center gap-2 rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Home className="h-4 w-4 text-rose-500" />
              <span>Buyer Portal</span>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="pt-3 border-t">
          <Link
            href="/farmer/overview"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:brightness-110 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Primary Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
