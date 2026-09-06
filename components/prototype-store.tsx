'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

type DemoEvent = {
  id: number;
  roleId: string;
  message: string;
  createdAt: string;
};

export type CreatedProduce = {
  id: string;
  crop: string;
  variety: string;
  stage: string;
  quantity: string;
  location: string;
  harvestDate: string;
  storageStatus: string;
  qualityStatus: string;
  notes: string;
};

export type CreatedAgreement = {
  id: string;
  actor: 'buyer' | 'fpo' | 'farmer';
  title: string;
  crop: string;
  grade: string;
  quantity: string;
  price: string;
  deliveryLocation: string;
  deliveryDate: string;
  expiry: string;
  status: string;
  visibility: 'public' | 'private';
  recipients?: string[];
  terms: Record<string, string>;
};

export type RequirementSourcing = {
  pendingOffers: number;
  gatheredQuantity: number;
};

export type CreatedServiceRequest = {
  id: string;
  produceId: string;
  produceName: string;
  produceStage: string;
  serviceId: string;
  serviceLabel: string;
  providerRole: 'fpo' | 'storage' | 'transport' | 'quality';
  destinationScreen: string;
  visibility: 'public' | 'private';
  recipient: string;
  location: string;
  requiredDate: string;
  quoteDeadline: string;
  requirements: Record<string, string>;
};

type PrototypeState = {
  events: DemoEvent[];
  createdProduce: CreatedProduce[];
  createdAgreements: CreatedAgreement[];
  agreementResponses: Record<string, string>;
  sentRequirementIds: string[];
  requirementSourcing: Record<string, RequirementSourcing>;
  createdServiceRequests: CreatedServiceRequest[];
  serviceRequestResponses: Record<string, string>;
};

type PrototypeAction =
  | { type: 'add_event'; roleId: string; message: string }
  | { type: 'add_produce'; produce: CreatedProduce }
  | { type: 'add_agreement'; agreement: CreatedAgreement }
  | { type: 'respond_to_agreement'; agreementId: string; response: string }
  | { type: 'mark_requirement_sent'; requirementId: string; pendingOffers: number }
  | { type: 'update_requirement_sourcing'; requirementId: string; sourcing: RequirementSourcing }
  | { type: 'add_service_request'; request: CreatedServiceRequest }
  | { type: 'respond_to_service_request'; requestId: string; response: string }
  | { type: 'reset' };

const seededServiceRequests: CreatedServiceRequest[] = [
  {
    id: 'SRV-301',
    produceId: 'PRD-112',
    produceName: 'Kharif Maize',
    produceStage: 'Pre-harvest',
    serviceId: 'harvesting',
    serviceLabel: 'Harvesting support',
    providerRole: 'fpo',
    destinationScreen: 'Service requests',
    visibility: 'public',
    recipient: 'All matching verified providers',
    location: 'Dindori, Nashik',
    requiredDate: '2026-09-22',
    quoteDeadline: '2026-09-10T18:00',
    requirements: {
      'Harvest date': '22 Sep 2026',
      'Preferred time window': '06:00–12:00',
      'Area to harvest': '2.4 acres',
      'Support required': 'Labour and machinery',
      'Field handling': 'Harvest and crate',
    },
  },
  {
    id: 'SRV-302',
    produceId: 'PRD-118',
    produceName: 'Summer Tomato',
    produceStage: 'Quantity recorded',
    serviceId: 'quality',
    serviceLabel: 'Quality assessment',
    providerRole: 'quality',
    destinationScreen: 'Requests',
    visibility: 'private',
    recipient: 'Dr. Meera Deshmukh',
    location: 'Niphad, Nashik',
    requiredDate: '2026-09-06',
    quoteDeadline: '2026-09-05T18:00',
    requirements: {
      'Assessment date': '6 Sep 2026',
      'Report purpose': 'Marketplace listing',
      'Target grade or specification': 'Grade A',
      'Requested parameters': 'Maturity, damage and size',
    },
  },
  {
    id: 'SRV-303',
    produceId: 'PRD-2408',
    produceName: 'Nashik Red Onion',
    produceStage: 'Quality assessed',
    serviceId: 'storage',
    serviceLabel: 'Storage',
    providerRole: 'storage',
    destinationScreen: 'Requests',
    visibility: 'public',
    recipient: 'All matching verified providers',
    location: 'Lasalgaon, Nashik',
    requiredDate: '2026-09-07',
    quoteDeadline: '2026-09-06T12:00',
    requirements: {
      'Check-in date': '7 Sep 2026',
      'Expected duration': '7 days',
      'Quantity to store': '4,280 kg',
      'Storage type': 'Ventilated storage',
      'Packaging and handling': 'Mesh bags; loading support required',
    },
  },
  {
    id: 'SRV-304',
    produceId: 'PRD-2408',
    produceName: 'Nashik Red Onion',
    produceStage: 'Storage / pickup pending',
    serviceId: 'transport',
    serviceLabel: 'Transport',
    providerRole: 'transport',
    destinationScreen: 'Quote requests',
    visibility: 'private',
    recipient: 'Nashik Agro Logistics',
    location: 'Lasalgaon, Nashik',
    requiredDate: '2026-09-07',
    quoteDeadline: '2026-09-06T12:00',
    requirements: {
      'Pickup date': '7 Sep 2026',
      'Pickup window': '08:00–11:00',
      'Pickup location': 'Lasalgaon farm gate',
      Destination: 'MahaFresh Foods, Pune',
      'Load and packaging': '4,280 kg in mesh bags',
      'Vehicle conditions': 'Closed dry vehicle',
    },
  },
];

const initialState: PrototypeState = {
  events: [],
  createdProduce: [],
  createdAgreements: [],
  agreementResponses: {},
  sentRequirementIds: [],
  requirementSourcing: {
    'REQ-331': { pendingOffers: 1, gatheredQuantity: 15280 },
    'REQ-328': { pendingOffers: 3, gatheredQuantity: 2000 },
  },
  createdServiceRequests: seededServiceRequests,
  serviceRequestResponses: {},
};

function reducer(state: PrototypeState, action: PrototypeAction): PrototypeState {
  if (action.type === 'reset') return initialState;
  if (action.type === 'add_produce') {
    return { ...state, createdProduce: [action.produce, ...(state.createdProduce ?? [])] };
  }
  if (action.type === 'add_agreement') {
    return { ...state, createdAgreements: [action.agreement, ...(state.createdAgreements ?? [])] };
  }
  if (action.type === 'respond_to_agreement') {
    return {
      ...state,
      agreementResponses: { ...state.agreementResponses, [action.agreementId]: action.response },
    };
  }
  if (action.type === 'mark_requirement_sent') {
    const sentRequirementIds = state.sentRequirementIds ?? [];
    const requirementSourcing = state.requirementSourcing ?? {};
    return {
      ...state,
      sentRequirementIds: sentRequirementIds.includes(action.requirementId)
        ? sentRequirementIds
        : [action.requirementId, ...sentRequirementIds],
      requirementSourcing: {
        ...requirementSourcing,
        [action.requirementId]: {
          pendingOffers: action.pendingOffers,
          gatheredQuantity: requirementSourcing[action.requirementId]?.gatheredQuantity ?? 0,
        },
      },
    };
  }
  if (action.type === 'update_requirement_sourcing') {
    return {
      ...state,
      requirementSourcing: { ...state.requirementSourcing, [action.requirementId]: action.sourcing },
    };
  }
  if (action.type === 'add_service_request') {
    return { ...state, createdServiceRequests: [action.request, ...(state.createdServiceRequests ?? [])] };
  }
  if (action.type === 'respond_to_service_request') {
    return {
      ...state,
      serviceRequestResponses: { ...state.serviceRequestResponses, [action.requestId]: action.response },
    };
  }
  const events = state.events ?? [];
  return {
    ...state,
    events: [
      {
        id: events.length + 1,
        roleId: action.roleId,
        message: action.message,
        createdAt: new Date().toISOString(),
      },
      ...events,
    ],
  };
}

const PrototypeContext = createContext<{
  state: PrototypeState;
  addEvent: (roleId: string, message: string) => void;
  addProduce: (produce: Omit<CreatedProduce, 'id'>) => CreatedProduce;
  addAgreement: (agreement: Omit<CreatedAgreement, 'id'>) => CreatedAgreement;
  respondToAgreement: (agreementId: string, response: string) => void;
  markRequirementSent: (requirementId: string, pendingOffers: number) => void;
  updateRequirementSourcing: (requirementId: string, sourcing: RequirementSourcing) => void;
  addServiceRequest: (request: Omit<CreatedServiceRequest, 'id'>) => CreatedServiceRequest;
  respondToServiceRequest: (requestId: string, response: string) => void;
  resetDemo: () => void;
} | null>(null);

type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: () => { status: string };
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};

export function PrototypeStore({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(modelContext.registerTool({
      name: 'reset_kisanmitra_demo',
      title: 'Reset KisanMitra demo',
      description: 'Restore the KisanMitra frontend prototype to its canonical mock-data state.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => {
        dispatch({ type: 'reset' });
        return { status: 'reset' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  const value = useMemo(() => {
    // Fast Refresh can preserve the previous store shape after a field is renamed.
    // Normalize at the context boundary so every consumer receives complete state.
    const normalizedState: PrototypeState = {
      ...state,
      events: state.events ?? [],
      createdProduce: state.createdProduce ?? [],
      createdAgreements: state.createdAgreements ?? [],
      agreementResponses: state.agreementResponses ?? {},
      sentRequirementIds: state.sentRequirementIds ?? [],
      requirementSourcing: state.requirementSourcing ?? {},
      createdServiceRequests: state.createdServiceRequests ?? [],
      serviceRequestResponses: state.serviceRequestResponses ?? {},
    };

    return {
      state: normalizedState,
      addEvent: (roleId: string, message: string) => dispatch({ type: 'add_event', roleId, message }),
      addProduce: (produce: Omit<CreatedProduce, 'id'>) => {
        const createdProduce = { ...produce, id: `PRD-DEMO-${String(normalizedState.createdProduce.length + 1).padStart(3, '0')}` };
        dispatch({ type: 'add_produce', produce: createdProduce });
        return createdProduce;
      },
      addAgreement: (agreement: Omit<CreatedAgreement, 'id'>) => {
        const prefix = agreement.actor === 'buyer' ? 'REQ' : agreement.actor === 'farmer' ? 'OFW' : 'CAM';
        const createdAgreement = {
          ...agreement,
          id: `${prefix}-DEMO-${String(normalizedState.createdAgreements.length + 1).padStart(3, '0')}`,
        };
        dispatch({ type: 'add_agreement', agreement: createdAgreement });
        return createdAgreement;
      },
      respondToAgreement: (agreementId: string, response: string) => dispatch({ type: 'respond_to_agreement', agreementId, response }),
      markRequirementSent: (requirementId: string, pendingOffers: number) => dispatch({ type: 'mark_requirement_sent', requirementId, pendingOffers }),
      updateRequirementSourcing: (requirementId: string, sourcing: RequirementSourcing) => dispatch({ type: 'update_requirement_sourcing', requirementId, sourcing }),
      addServiceRequest: (request: Omit<CreatedServiceRequest, 'id'>) => {
        const createdRequest = {
          ...request,
          id: `SRV-DEMO-${String(normalizedState.createdServiceRequests.length + 1).padStart(3, '0')}`,
        };
        dispatch({ type: 'add_service_request', request: createdRequest });
        return createdRequest;
      },
      respondToServiceRequest: (requestId: string, response: string) => dispatch({ type: 'respond_to_service_request', requestId, response }),
      resetDemo: () => dispatch({ type: 'reset' }),
    };
  }, [state]);

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototypeStore() {
  const context = useContext(PrototypeContext);
  if (!context) throw new Error('usePrototypeStore must be used inside PrototypeStore');
  return context;
}
