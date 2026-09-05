'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChevronRight, Clock3, ListFilter, Search,
} from 'lucide-react';

import workspaceFixtures from '@/mockdata/workspaces.json';
import { AgreementReviewSheet, getAgreementView } from '@/components/commercial-agreement';
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

export function WorkspaceView({
  roleId,
  screenName,
  onAction,
}: {
  roleId: string;
  screenName: string;
  onAction: (message: string) => void;
}) {
  const screen = getWorkspaceScreen(roleId, screenName);
  const { state: prototypeState, respondToAgreement } = usePrototypeStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<WorkspaceRecord | null>(null);

  const records = useMemo(() => {
    if (!screen) return [];
    if ((roleId === 'buyer' && screenName === 'Requirements') || (roleId === 'fpo' && screenName === 'Campaigns')) {
      const createdRecords: WorkspaceRecord[] = prototypeState.createdAgreements
        .filter((agreement) => agreement.actor === roleId)
        .map((agreement) => ({
          id: agreement.id,
          title: `${agreement.crop} · ${agreement.grade}`,
          subtitle: `${agreement.deliveryLocation} · Created this session`,
          metric: `${Number(agreement.quantity).toLocaleString('en-IN')} kg`,
          status: agreement.status,
          tone: 'positive',
          progress: 0,
          stage: 'Seller review',
          nextAction: 'Review agreement',
          details: [
            `Price: ₹${agreement.price}/kg`,
            `Delivery: ${agreement.deliveryDate}`,
            `Proposal expiry: ${agreement.expiry}`,
            'Accepted terms become a frozen trade',
          ],
        }));
      return [...createdRecords, ...screen.records];
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
      details: [
        `Produce stage: ${produce.stage}`,
        `Harvest date: ${produce.harvestDate}`,
        `Storage: ${produce.storageStatus}`,
        `Quality: ${produce.qualityStatus}`,
        ...(produce.notes ? [`Notes: ${produce.notes}`] : []),
      ],
    }));
    return [...createdRecords, ...screen.records];
  }, [prototypeState.createdAgreements, prototypeState.createdProduce, roleId, screen, screenName]);

  const agreementScreen = (roleId === 'farmer' && screenName === 'Offers')
    || (roleId === 'buyer' && screenName === 'Requirements')
    || (roleId === 'fpo' && screenName === 'Campaigns');
  const selectedCreatedAgreement = selectedRecord
    ? prototypeState.createdAgreements.find((agreement) => agreement.id === selectedRecord.id)
    : undefined;
  const selectedAgreement = selectedRecord && agreementScreen
    ? getAgreementView(selectedRecord.id, selectedCreatedAgreement)
    : undefined;

  const filteredRecords = useMemo(() => {
    if (!screen) return [];
    return records.filter((record) => {
      const matchesQuery = `${record.title} ${record.subtitle} ${record.id} ${record.status}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = activeFilter === 'All'
        || record.status.toLowerCase().includes(activeFilter.toLowerCase())
        || record.stage.toLowerCase().includes(activeFilter.toLowerCase());
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query, records, screen]);

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
                key={filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="work-record-list">
            {filteredRecords.map((record) => (
              <article className="work-record" key={record.id}>
                <button className="record-main" onClick={() => setSelectedRecord(record)}>
                  <span className="record-id">{record.id}</span>
                  <span className="record-name"><strong>{record.title}</strong><small>{record.subtitle}</small></span>
                  <span className="record-metric"><strong>{record.metric}</strong><small>{record.stage}</small></span>
                  <Status tone={record.tone}>{record.status}</Status>
                  <ChevronRight aria-hidden="true" />
                </button>
                <div className="record-action-row">
                  <span><small>Current stage</small><strong>{record.stage}</strong></span>
                  <Button variant="outline" size="sm" onClick={() => agreementScreen ? setSelectedRecord(record) : onAction(`${record.nextAction} started for ${record.id}.`)}>
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

      <Sheet open={Boolean(selectedRecord && !selectedAgreement)} onOpenChange={(open) => !open && setSelectedRecord(null)}>
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
                <Button onClick={() => { onAction(`${selectedRecord.nextAction} started for ${selectedRecord.id}.`); setSelectedRecord(null); }}>
                  {selectedRecord.nextAction}<ArrowRight data-icon="inline-end" />
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      <AgreementReviewSheet
        agreement={selectedAgreement}
        open={Boolean(selectedAgreement)}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        ownerView={roleId !== 'farmer'}
        response={selectedAgreement ? prototypeState.agreementResponses[selectedAgreement.id] : undefined}
        onRespond={respondToAgreement}
        onAction={onAction}
      />
    </>
  );
}
