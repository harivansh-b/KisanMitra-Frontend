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
  actor: 'buyer' | 'fpo';
  title: string;
  crop: string;
  grade: string;
  quantity: string;
  price: string;
  deliveryLocation: string;
  deliveryDate: string;
  expiry: string;
  status: string;
  terms: Record<string, string>;
};

type PrototypeState = {
  events: DemoEvent[];
  createdProduce: CreatedProduce[];
  createdAgreements: CreatedAgreement[];
  agreementResponses: Record<string, string>;
};

type PrototypeAction =
  | { type: 'add_event'; roleId: string; message: string }
  | { type: 'add_produce'; produce: CreatedProduce }
  | { type: 'add_agreement'; agreement: CreatedAgreement }
  | { type: 'respond_to_agreement'; agreementId: string; response: string }
  | { type: 'reset' };

const initialState: PrototypeState = { events: [], createdProduce: [], createdAgreements: [], agreementResponses: {} };

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
        const prefix = agreement.actor === 'buyer' ? 'REQ' : 'CAM';
        const createdAgreement = {
          ...agreement,
          id: `${prefix}-DEMO-${String(normalizedState.createdAgreements.length + 1).padStart(3, '0')}`,
        };
        dispatch({ type: 'add_agreement', agreement: createdAgreement });
        return createdAgreement;
      },
      respondToAgreement: (agreementId: string, response: string) => dispatch({ type: 'respond_to_agreement', agreementId, response }),
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
