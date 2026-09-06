'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleDashed, Clock3, Leaf, ListFilter, Search, ShieldCheck,
} from 'lucide-react';

import { workspacesFixture as workspaceFixtures } from '@/data/fixtures';
import { AgreementReviewSheet, getAgreementView } from '@/components/commercial-agreement';
import { ProduceServicesSheet, ServiceRequestReviewSheet } from '@/components/service-request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePrototypeStore } from '@/components/prototype-store';
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'positive' | 'warning';

export type WorkspaceField = {
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
  options?: string[];
  help?: string;
};

export type WorkspaceRecord = {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  status: string;
  tone: Tone;
  progress: number;
  stage: string;
  nextAction: string;
  details: string[];
  visibility?: 'public' | 'private';
  pendingOffers?: number;
  gatheredQuantity?: number;
  targetQuantity?: number;
  recordType?: 'service-request' | 'farmer-offer';
  conditionScore?: number;
  conditionLabel?: string;
  conditionBasis?: string;
  qualityLabel?: string;
  qualityVerified?: boolean;
  harvestLabel?: string;
};

export type WorkspaceScreen = {
  subtitle: string;
  primaryAction: string;
  filters: string[];
  fields: WorkspaceField[];
  records: WorkspaceRecord[];
};

const workspaces = workspaceFixtures as unknown as Record<string, Record<string, WorkspaceScreen>>;

export function getWorkspaceScreen(roleId: string, screenName: string) {
  return workspaces[roleId]?.[screenName];
}

function Status({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={cn('status-badge', `status-${tone}`)}>{children}</span>;
}

function estimateCreatedProduceCondition(stage: string, storageStatus: string, qualityStatus: string) {
  if (stage === 'Pre-harvest') return undefined;
  let score = stage === 'Harvested' ? 98 : stage === 'Quantity recorded' ? 86 : stage === 'In storage' ? 90 : 84;
  if (storageStatus === 'Currently stored') score += 4;
  if (storageStatus === 'Storage needed') score -= 20;
  if (qualityStatus === 'Assessed and valid') score += 3;
  if (qualityStatus === 'Reassessment needed') score -= 12;
  return Math.min(98, Math.max(40, score));
}

function ProduceRecordCard({ record, onOpen, onAction }: {
  record: WorkspaceRecord;
  onOpen: () => void;
  onAction: () => void;
}) {
  const score = record.conditionScore;
  const conditionTone = score === undefined ? 'pending' : score >= 85 ? 'good' : score >= 65 ? 'watch' : 'risk';
  return (
    <article className="produce-record-card">
      <button className="produce-card-main" onClick={onOpen}>
        <span className="produce-card-heading">
          <span className="produce-card-icon"><Leaf aria-hidden="true" /></span>
          <span><small>{record.id}</small><strong>{record.title}</strong><em>{record.subtitle}</em></span>
        </span>
        <Status tone={record.tone}>{record.status}</Status>
      </button>
      <div className="produce-card-facts">
        <span><small>Available quantity</small><strong>{record.metric}</strong></span>
        <span><small>Current stage</small><strong>{record.stage}</strong></span>
        <span><small>Harvest</small><strong><CalendarDays aria-hidden="true" />{record.harvestLabel ?? 'Date recorded'}</strong></span>
        <span><small>Quality</small><strong><ShieldCheck aria-hidden="true" />{record.qualityLabel ?? record.status}</strong></span>
      </div>
      <section className={cn('produce-condition', `condition-${conditionTone}`)} aria-label={score === undefined ? 'Condition estimate starts after harvest' : `Estimated produce condition ${score} percent`}>
        <div className="condition-heading">
          <span><small>Estimated produce condition</small><strong>{record.conditionLabel ?? 'Handling status recorded'}</strong></span>
          <b>{score === undefined ? '—' : `${score}%`}</b>
        </div>
        <div className="condition-segments" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <i className={cn(score !== undefined && score > index * 10 && 'is-filled')} key={index} />)}
        </div>
        <p>{record.conditionBasis ?? 'Estimated from the recorded harvest, handling and storage status.'}</p>
        <small className="condition-disclaimer">Handling estimate · not a verified quality grade</small>
      </section>
      <div className="produce-card-action">
        <span><small>Recommended next step</small><strong>{record.nextAction}</strong></span>
        <Button variant="outline" size="sm" onClick={onAction}>{record.nextAction}<ArrowRight data-icon="inline-end" /></Button>
      </div>
    </article>
  );
}

function serviceProduceId(record: WorkspaceRecord) {
  const produceDetail = record.details.find((detail) => detail.startsWith('Produce:'));
  return produceDetail?.split(':').slice(1).join(':').trim() || 'OTHER';
}

function FarmerServiceGroups({ records, produceNames, onOpen }: {
  records: WorkspaceRecord[];
  produceNames: Map<string, string>;
  onOpen: (record: WorkspaceRecord) => void;
}) {
  const groups = useMemo(() => {
    const grouped = new Map<string, WorkspaceRecord[]>();
    records.forEach((record) => {
      const produceId = serviceProduceId(record);
      grouped.set(produceId, [...(grouped.get(produceId) ?? []), record]);
    });
    return Array.from(grouped, ([produceId, services]) => ({
      produceId,
      produceName: produceNames.get(produceId)
        ?? services.find((service) => service.recordType === 'service-request')?.title.split(' · ').at(-1)
        ?? 'Other produce services',
      services,
    }));
  }, [produceNames, records]);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const activeGroup = openGroup === null ? groups[0]?.produceId : openGroup;

  return (
    <div className="farmer-service-groups">
      {groups.map((group) => {
        const expanded = activeGroup === group.produceId;
        const attention = group.services.filter((service) => service.tone === 'warning').length;
        const completed = group.services.filter((service) => service.status.toLowerCase().includes('completed') || service.status.toLowerCase().includes('awarded')).length;
        return (
          <article className={cn('farmer-service-group', expanded && 'is-open')} key={group.produceId}>
            <button className="service-group-trigger" aria-expanded={expanded} onClick={() => setOpenGroup(expanded ? '' : group.produceId)}>
              <span className="service-group-produce"><span className="service-group-icon"><Leaf /></span><span><small>{group.produceId === 'OTHER' ? 'Additional services' : group.produceId}</small><strong>{group.produceName}</strong></span></span>
              <span className="service-group-counts"><span><strong>{group.services.length}</strong><small>Services</small></span><span><strong>{completed}</strong><small>Complete</small></span>{attention > 0 && <Status tone="warning">{attention} needs action</Status>}</span>
              <ChevronDown className={cn(expanded && 'is-rotated')} aria-hidden="true" />
            </button>
            {expanded && (
              <div className="service-group-panel">
                <div className="service-group-labels"><span>Service</span><span>Schedule or cost</span><span>Status</span><span>Action</span></div>
                {group.services.map((service) => {
                  const done = service.status.toLowerCase().includes('completed') || service.status.toLowerCase().includes('awarded');
                  const active = service.status.toLowerCase().includes('accepted') || service.status.toLowerCase().includes('way');
                  return (
                    <div className="grouped-service-row" key={service.id}>
                      <span className={cn('service-state-marker', done && 'is-complete', active && 'is-active')}>{done ? <Check /> : active ? <Clock3 /> : <CircleDashed />}</span>
                      <button className="grouped-service-name" onClick={() => onOpen(service)}><strong>{service.title.split(' · ')[0]}</strong><small>{service.id} · {service.subtitle}</small></button>
                      <span className="grouped-service-metric"><strong>{service.metric}</strong><small>{service.stage}</small></span>
                      <Status tone={service.tone}>{service.status}</Status>
                      <Button variant="outline" size="sm" onClick={() => onOpen(service)}>{service.nextAction}<ArrowRight data-icon="inline-end" /></Button>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function WorkspaceView({
  roleId,
  screenName,
  onAction,
  onOpenProcurementPlan,
}: {
  roleId: string;
  screenName: string;
  onAction: (message: string) => void;
  onOpenProcurementPlan?: (requirementId?: string) => void;
}) {
  const screen = getWorkspaceScreen(roleId, screenName);
  const {
    state: prototypeState, addServiceRequest, respondToAgreement, respondToServiceRequest,
  } = usePrototypeStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<WorkspaceRecord | null>(null);

  const records = useMemo(() => {
    if (!screen) return [];
    const farmerOfferRecords: WorkspaceRecord[] = prototypeState.createdAgreements
      .filter((agreement) => agreement.actor === 'farmer')
      .map((agreement) => ({
        id: agreement.id,
        title: `${agreement.crop} · ${agreement.grade}`,
        subtitle: agreement.visibility === 'private'
          ? `Private offer window · ${agreement.recipients?.length ?? 0} invited Buyers/FPOs`
          : 'Public offer window · eligible verified Buyers/FPOs',
        metric: `${Number(agreement.quantity).toLocaleString('en-IN')} kg offered`,
        status: agreement.status,
        tone: agreement.status === 'Draft' ? 'neutral' : agreement.visibility === 'private' ? 'warning' : 'positive',
        progress: 0,
        stage: agreement.status === 'Draft' ? 'Draft' : 'Collecting offers',
        nextAction: roleId === 'farmer' ? 'Review offer window' : 'Review sale terms',
        visibility: agreement.visibility,
        recordType: 'farmer-offer',
        details: [
          `Produce: ${agreement.terms.produce_id || agreement.crop}`,
          `Minimum price: ₹${agreement.price}/kg`,
          `Available from: ${agreement.deliveryDate}`,
          `Offer deadline: ${agreement.expiry}`,
          agreement.visibility === 'private' ? `Recipients: ${agreement.recipients?.join(', ') || 'Not selected'}` : 'Visibility: Public marketplace',
        ],
      }));
    const isFarmerServiceDesk = roleId === 'farmer' && screenName === 'Services';
    const isProviderServiceDesk = prototypeState.createdServiceRequests.some(
      (request) => request.providerRole === roleId && request.destinationScreen === screenName,
    );
    if (isFarmerServiceDesk || isProviderServiceDesk) {
      const serviceRecords: WorkspaceRecord[] = prototypeState.createdServiceRequests
        .filter((request) => isFarmerServiceDesk
          || (request.providerRole === roleId && request.destinationScreen === screenName))
        .map((request) => {
          const response = prototypeState.serviceRequestResponses[request.id];
          return {
            id: request.id,
            title: `${request.serviceLabel} · ${request.produceName}`,
            subtitle: request.visibility === 'private' ? `Private request · ${request.recipient}` : 'Public request · matching verified providers',
            metric: request.requiredDate || 'Date to be agreed',
            status: response ?? 'Response requested',
            tone: response?.startsWith('Accepted') || response?.startsWith('Awarded') ? 'positive' : response?.startsWith('Declined') ? 'neutral' : 'warning',
            progress: 0,
            stage: response?.startsWith('Awarded') ? 'Booking confirmed' : response ? 'Provider response received' : 'Service request open',
            nextAction: response ? 'Review response' : roleId === 'farmer' ? 'View request' : 'Review request',
            visibility: request.visibility,
            recordType: 'service-request',
            details: [
              `Produce: ${request.produceId}`,
              `Produce stage: ${request.produceStage}`,
              `Location: ${request.location}`,
              `Responses close: ${request.quoteDeadline}`,
            ],
          };
        });
      return [...serviceRecords, ...screen.records];
    }
    if ((roleId === 'buyer' && screenName === 'Requirements') || (roleId === 'fpo' && screenName === 'Campaigns')) {
      const createdRecords: WorkspaceRecord[] = prototypeState.createdAgreements
        .filter((agreement) => agreement.actor === roleId)
        .map((agreement) => {
          const sourcing = prototypeState.requirementSourcing[agreement.id];
          const isDraft = agreement.status === 'Draft';
          const isPrivate = agreement.visibility === 'private';
          return {
            id: agreement.id,
            title: `${agreement.crop} · ${agreement.grade}`,
            subtitle: `${isPrivate ? 'Private requirement' : 'Public requirement'} · ${agreement.deliveryLocation}`,
            metric: `${Number(agreement.quantity).toLocaleString('en-IN')} kg required`,
            status: agreement.status,
            tone: isDraft ? 'neutral' : isPrivate ? 'warning' : 'positive',
            progress: 0,
            stage: isDraft ? 'Draft' : isPrivate ? 'Private acceptance window' : 'Public proposal collection',
            nextAction: isDraft ? 'Review draft' : isPrivate ? 'Manage commitments' : 'Review proposals',
            visibility: agreement.visibility,
            pendingOffers: sourcing?.pendingOffers ?? 0,
            gatheredQuantity: sourcing?.gatheredQuantity ?? 0,
            targetQuantity: Number(agreement.quantity),
            details: [
              `Visibility: ${isPrivate ? 'Private recipients only' : 'Public marketplace'}`,
              `Price: ₹${agreement.price}/kg`,
              `Delivery: ${agreement.deliveryDate}`,
              `Proposal expiry: ${agreement.expiry}`,
              isPrivate ? 'Accepted quantities reserve immediately; accepted sellers are locked' : 'Seller proposals require an explicit Buyer award',
            ],
          } as WorkspaceRecord;
        });
      const fixtureRecords = roleId === 'buyer' ? screen.records.map((record) => {
        const sourcing = prototypeState.requirementSourcing[record.id];
        return sourcing ? { ...record, pendingOffers: sourcing.pendingOffers, gatheredQuantity: sourcing.gatheredQuantity } : record;
      }) : screen.records;
      return [...createdRecords, ...fixtureRecords];
    }
    if (roleId === 'buyer' && screenName === 'Marketplace') {
      const visibleOffers = farmerOfferRecords.filter((record) => {
        const agreement = prototypeState.createdAgreements.find((item) => item.id === record.id);
        return agreement?.status !== 'Draft' && (agreement?.visibility === 'public' || agreement?.recipients?.includes('MahaFresh Foods'));
      });
      return [...visibleOffers, ...screen.records];
    }
    if (roleId === 'fpo' && screenName === 'Farmer supply') {
      const visibleOffers = farmerOfferRecords.filter((record) => {
        const agreement = prototypeState.createdAgreements.find((item) => item.id === record.id);
        return agreement?.status !== 'Draft' && (agreement?.visibility === 'public' || agreement?.recipients?.includes('Nashik Farmers Producer Co.'));
      });
      return [...visibleOffers, ...screen.records];
    }
    if ((roleId === 'farmer' && screenName === 'Offers') || (roleId === 'fpo' && (screenName === 'Open demand' || screenName === 'Responses'))) {
      const createdDemandRecords: WorkspaceRecord[] = prototypeState.createdAgreements
        .filter((agreement) => agreement.actor === 'buyer'
          && agreement.status !== 'Draft'
          && (agreement.visibility === 'public' || prototypeState.sentRequirementIds.includes(agreement.id))
          && (roleId !== 'fpo'
            || (screenName === 'Responses') === Boolean(prototypeState.agreementResponses[`fpo:${agreement.id}`])))
        .map((agreement) => {
          const response = prototypeState.agreementResponses[`${roleId}:${agreement.id}`];
          return {
            id: agreement.id,
            title: `${agreement.crop} · ${agreement.grade}`,
            subtitle: `${agreement.visibility === 'private' ? 'Private direct offer' : 'Public requirement'} from MahaFresh Foods · ${agreement.deliveryLocation}`,
            metric: `₹${agreement.price}/kg`,
            status: response || 'Awaiting your response',
            tone: response ? 'positive' : 'warning',
            progress: 0,
            stage: response
              ? agreement.visibility === 'private' && response.includes('Committed') ? 'Quantity committed' : 'Response submitted'
              : agreement.visibility === 'private' ? 'Direct offer awaiting decision' : 'Public proposal window',
            nextAction: response ? 'Review response' : 'Review demand terms',
            details: [
              `Required: ${Number(agreement.quantity).toLocaleString('en-IN')} kg`,
              `Delivery: ${agreement.deliveryDate}`,
              `Proposal expiry: ${agreement.expiry}`,
              agreement.visibility === 'private' ? 'Acceptance reserves quantity immediately and locks your participation' : 'A supply proposal remains unreserved until Buyer award',
            ],
          } as WorkspaceRecord;
        });
      return [...(roleId === 'farmer' ? farmerOfferRecords : []), ...createdDemandRecords, ...screen.records];
    }
    if (roleId !== 'farmer' || screenName !== 'Produce') return screen.records;
    const createdRecords: WorkspaceRecord[] = prototypeState.createdProduce.map((produce) => ({
      id: produce.id,
      title: produce.variety ? `${produce.crop} · ${produce.variety}` : produce.crop,
      subtitle: `${produce.location} · Created this session`,
      metric: `${Number(produce.quantity).toLocaleString('en-IN')} kg`,
      status: produce.qualityStatus,
      tone: produce.qualityStatus === 'Assessed and valid' ? 'positive' : produce.qualityStatus === 'Assessment requested' || produce.qualityStatus === 'Reassessment needed' ? 'warning' : 'neutral',
      progress: 0,
      stage: produce.stage,
      nextAction: produce.stage === 'Pre-harvest' ? 'Update harvest' : produce.qualityStatus === 'Not assessed' ? 'Request assessment' : 'Open produce',
      conditionScore: estimateCreatedProduceCondition(produce.stage, produce.storageStatus, produce.qualityStatus),
      conditionLabel: produce.stage === 'Pre-harvest' ? 'Starts after harvest' : produce.storageStatus === 'Currently stored' ? 'Protected in storage' : produce.storageStatus === 'Storage needed' ? 'Storage needs attention' : produce.stage === 'Harvested' ? 'Recently harvested' : 'Handling recorded',
      conditionBasis: produce.stage === 'Pre-harvest' ? 'No post-harvest condition estimate yet' : `${produce.harvestDate ? `Harvest date ${produce.harvestDate}` : 'Harvest recorded'} · ${produce.storageStatus.toLowerCase()}`,
      qualityLabel: produce.qualityStatus,
      qualityVerified: produce.qualityStatus === 'Assessed and valid',
      harvestLabel: produce.stage === 'Pre-harvest' ? `Expected ${produce.harvestDate}` : `Harvested ${produce.harvestDate}`,
      details: [
        `Produce stage: ${produce.stage}`,
        `Harvest date: ${produce.harvestDate}`,
        `Storage: ${produce.storageStatus}`,
        `Quality: ${produce.qualityStatus}`,
        ...(produce.notes ? [`Notes: ${produce.notes}`] : []),
      ],
    }));
    return [...createdRecords, ...screen.records];
  }, [prototypeState.agreementResponses, prototypeState.createdAgreements, prototypeState.createdProduce, prototypeState.createdServiceRequests, prototypeState.requirementSourcing, prototypeState.sentRequirementIds, prototypeState.serviceRequestResponses, roleId, screen, screenName]);

  const agreementScreen = (roleId === 'farmer' && screenName === 'Offers')
    || (roleId === 'buyer' && screenName === 'Requirements')
    || (roleId === 'fpo' && (screenName === 'Campaigns' || screenName === 'Open demand' || screenName === 'Responses'));
  const selectedCreatedAgreement = selectedRecord
    ? prototypeState.createdAgreements.find((agreement) => agreement.id === selectedRecord.id)
    : undefined;
  const selectedAgreement = selectedRecord && (agreementScreen || selectedRecord.recordType === 'farmer-offer')
    ? getAgreementView(selectedRecord.id, selectedCreatedAgreement)
    : undefined;
  const selectedServiceRequest = selectedRecord?.recordType === 'service-request'
    ? prototypeState.createdServiceRequests.find((request) => request.id === selectedRecord.id)
    : undefined;

  const filteredRecords = useMemo(() => {
    if (!screen) return [];
    return records.filter((record) => {
      const matchesQuery = `${record.title} ${record.subtitle} ${record.id} ${record.status}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = activeFilter === 'All'
        || record.status.toLowerCase().includes(activeFilter.toLowerCase())
        || record.stage.toLowerCase().includes(activeFilter.toLowerCase())
        || record.subtitle.toLowerCase().includes(activeFilter.toLowerCase())
        || record.details.some((detail) => detail.toLowerCase().includes(activeFilter.toLowerCase()));
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query, records, screen]);
  const farmerProduceNames = useMemo(() => new Map([
    ...(workspaces.farmer?.Produce?.records ?? []).map((record) => [record.id, record.title] as const),
    ...prototypeState.createdProduce.map((produce) => [produce.id, produce.variety ? `${produce.crop} · ${produce.variety}` : produce.crop] as const),
  ]), [prototypeState.createdProduce]);

  if (!screen) {
    return (
      <section className="empty-workspace panel">
        <ListFilter />
        <h2>This workspace is being prepared</h2>
        <p>The overview remains available while this role-specific view is completed.</p>
      </section>
    );
  }

  const attentionCount = records.filter((record) => record.tone === 'warning').length;
  function runRecordAction(record: WorkspaceRecord) {
    if (record.recordType === 'service-request' || record.recordType === 'farmer-offer' || (roleId === 'farmer' && screenName === 'Produce')) {
      setSelectedRecord(record);
      return;
    }
    if (roleId === 'buyer' && screenName === 'Marketplace') {
      onOpenProcurementPlan?.();
      return;
    }
    if (roleId === 'buyer' && screenName === 'Requirements' && record.status !== 'Draft') {
      onOpenProcurementPlan?.(record.id);
      return;
    }
    if (agreementScreen) {
      setSelectedRecord(record);
      return;
    }
    onAction(`${record.nextAction} started for ${record.id}.`);
  }

  return (
    <>
      <section className={cn('workspace-summary', `workspace-summary-${roleId}`)} aria-label={`${screenName} summary`}>
        <div><span>Records</span><strong>{records.length}</strong></div>
        <div><span>Needs attention</span><strong>{attentionCount}</strong></div>
        <div><span>Visible now</span><strong>{filteredRecords.length}</strong></div>
        <div><span>Data mode</span><strong>Local demo</strong></div>
      </section>

      <section className={cn('workspace-board panel', `workspace-board-${roleId}`)}>
        <div className="workspace-toolbar">
          <div className="workspace-search">
            <Search aria-hidden="true" />
            <Input
              aria-label={`Search ${screenName}`}
              placeholder={`Search ${screenName.toLowerCase()}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="filter-row" aria-label="Record filters">
            {screen.filters.map((filter) => (
              <button
                className={cn('filter-chip', activeFilter === filter && 'is-active')}
                aria-pressed={activeFilter === filter}
                key={filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length > 0 ? roleId === 'farmer' && screenName === 'Services' ? (
          <FarmerServiceGroups records={filteredRecords} produceNames={farmerProduceNames} onOpen={setSelectedRecord} />
        ) : (
          <div className={cn('work-record-list', roleId === 'farmer' && screenName === 'Produce' && 'produce-record-list')}>
            {filteredRecords.map((record) => roleId === 'farmer' && screenName === 'Produce' ? (
              <ProduceRecordCard
                key={record.id}
                record={record}
                onOpen={() => setSelectedRecord(record)}
                onAction={() => runRecordAction(record)}
              />
            ) : (
              <article className="work-record" key={record.id}>
                <button className="record-main" onClick={() => setSelectedRecord(record)}>
                  <span className="record-id">{record.id}</span>
                  <span className="record-name"><strong>{record.title}</strong><small>{record.subtitle}</small></span>
                  <span className="record-metric"><strong>{record.metric}</strong><small>{record.stage}</small></span>
                  <Status tone={record.tone}>{record.status}</Status>
                  <ChevronRight aria-hidden="true" />
                </button>
                {roleId === 'buyer' && screenName === 'Requirements' && (
                  <div className="requirement-sourcing-strip">
                    <span><small>Visibility</small><strong>{record.visibility === 'private' ? 'Private' : 'Public'}</strong></span>
                    <span><small>{record.visibility === 'private' ? 'Invites pending' : 'Proposals pending'}</small><strong>{record.pendingOffers ?? 0}</strong></span>
                    <span><small>{record.visibility === 'private' ? 'Accepted and locked' : 'Buyer awarded'}</small><strong>{record.gatheredQuantity !== undefined ? `${record.gatheredQuantity.toLocaleString('en-IN')} of ${(record.targetQuantity ?? 0).toLocaleString('en-IN')} kg` : record.metric}</strong></span>
                  </div>
                )}
                <div className="record-action-row">
                  <span><small>Current stage</small><strong>{record.stage}</strong></span>
                  <Button variant="outline" size="sm" onClick={() => runRecordAction(record)}>
                    {record.nextAction}<ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-workspace">
            <Search /><h2>No matching records</h2><p>Try another search or clear the current filter.</p>
            <Button variant="outline" onClick={() => { setQuery(''); setActiveFilter('All'); }}>Clear filters</Button>
          </div>
        )}
      </section>

      <Sheet open={Boolean(selectedRecord && !selectedAgreement && !selectedServiceRequest && !(roleId === 'farmer' && screenName === 'Produce'))} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <SheetContent className="record-sheet">
          {selectedRecord && (
            <>
              <SheetHeader className="record-sheet-header">
                <div className="record-sheet-heading">
                  <span className="record-id">{selectedRecord.id}</span>
                  <Status tone={selectedRecord.tone}>{selectedRecord.status}</Status>
                </div>
                <SheetTitle>{selectedRecord.title}</SheetTitle>
                <SheetDescription>{selectedRecord.subtitle}</SheetDescription>
              </SheetHeader>
              <div className="record-sheet-body">
                <section className="detail-section">
                  <h3>Current stage</h3>
                  <div className="current-stage-card"><Clock3 /><span><strong>{selectedRecord.stage}</strong><small>{selectedRecord.status}</small></span></div>
                </section>
                <section className="detail-section">
                  <h3>Key details</h3>
                  <dl className="detail-list">
                    {selectedRecord.details.map((detail) => {
                      const [label, ...valueParts] = detail.split(':');
                      return <div key={detail}><dt>{label}</dt><dd>{valueParts.join(':').trim() || '—'}</dd></div>;
                    })}
                  </dl>
                </section>
                <section className="detail-section">
                  <h3>Activity</h3>
                  <ol className="activity-timeline">
                    <li className="is-complete"><CheckCircle2 /><span><strong>Record created</strong><small>Canonical demo fixture</small></span></li>
                    <li className="is-complete"><CheckCircle2 /><span><strong>Checks completed</strong><small>Required information recorded</small></span></li>
                    <li><Clock3 /><span><strong>{selectedRecord.stage}</strong><small>Current lifecycle state</small></span></li>
                  </ol>
                </section>
                <aside className="ownership-note">
                  <strong>Terms and ownership remain explicit</strong>
                  <p>Service responsibility, payment responsibility and crop ownership are shown separately throughout this workflow.</p>
                </aside>
              </div>
              <SheetFooter className="record-sheet-footer">
                <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
                <Button onClick={() => { runRecordAction(selectedRecord); if (!(roleId === 'buyer' && screenName === 'Requirements' && selectedRecord.visibility === 'private')) setSelectedRecord(null); }}>
                  {selectedRecord.nextAction}<ArrowRight data-icon="inline-end" />
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      <ProduceServicesSheet
        produce={selectedRecord && roleId === 'farmer' && screenName === 'Produce' ? {
          id: selectedRecord.id,
          title: selectedRecord.title,
          subtitle: selectedRecord.subtitle,
          quantity: selectedRecord.metric,
          stage: selectedRecord.stage,
          details: selectedRecord.details,
        } : undefined}
        open={Boolean(selectedRecord && roleId === 'farmer' && screenName === 'Produce')}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        onCreateRequest={(request) => {
          const created = addServiceRequest(request);
          onAction(`${created.id} published as a ${created.visibility} ${created.serviceLabel.toLowerCase()} request.`);
        }}
      />
      <ServiceRequestReviewSheet
        request={selectedServiceRequest}
        open={Boolean(selectedServiceRequest)}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        ownerView={roleId === 'farmer'}
        response={selectedServiceRequest ? prototypeState.serviceRequestResponses[selectedServiceRequest.id] : undefined}
        onRespond={respondToServiceRequest}
        onAction={onAction}
      />
      <AgreementReviewSheet
        agreement={selectedAgreement}
        open={Boolean(selectedAgreement)}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        ownerView={(roleId === 'buyer' && screenName === 'Requirements') || (roleId === 'fpo' && screenName === 'Campaigns') || (roleId === 'farmer' && screenName === 'Offers' && selectedRecord?.recordType === 'farmer-offer')}
        negotiator={selectedRecord?.recordType === 'farmer-offer' ? 'buyer' : roleId === 'fpo' ? 'fpo' : 'farmer'}
        responseKey={selectedAgreement ? `${roleId}:${selectedAgreement.id}` : undefined}
        response={selectedAgreement ? prototypeState.agreementResponses[`${roleId}:${selectedAgreement.id}`] : undefined}
        onRespond={respondToAgreement}
        onAction={onAction}
      />
    </>
  );
}
