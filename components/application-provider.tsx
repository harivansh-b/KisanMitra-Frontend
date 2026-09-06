'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import type { ActorContext, RoleId } from '@/domain/contracts';
import { PrototypeStore } from '@/components/prototype-store';

const actorNames: Record<RoleId, string> = {
  farmer: 'Ramesh Patil', fpo: 'Nashik Farmers Producer Co.', buyer: 'MahaFresh Foods',
  storage: 'Nashik Cold Chain', transport: 'Nashik Agro Logistics', quality: 'Dr. Meera Deshmukh', admin: 'Platform Operations',
};

const actors = (Object.keys(actorNames) as RoleId[]).map((role) => ({
  id: `actor_${role}` as ActorContext['activeActorId'], role, displayName: actorNames[role],
}));

const ActorContextValue = createContext<ActorContext | null>(null);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }));
  const actorContext: ActorContext = {
    userId: 'user_demo' as ActorContext['userId'], activeActorId: actors[0].id, availableActors: actors,
    permissions: ['produce:write', 'agreement:write', 'procurement:write', 'service:write', 'operations:write', 'admin:review'],
    restrictions: [], locale: 'en-IN', timeZone: 'Asia/Kolkata',
  };
  return <QueryClientProvider client={queryClient}><ActorContextValue.Provider value={actorContext}><PrototypeStore>{children}</PrototypeStore></ActorContextValue.Provider></QueryClientProvider>;
}

export function useActorContext() {
  const value = useContext(ActorContextValue);
  if (!value) throw new Error('useActorContext must be used inside ApplicationProvider');
  return value;
}

