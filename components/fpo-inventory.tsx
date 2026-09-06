'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight, Boxes, Check, ChevronRight, Circle, Clock3, GitMerge,
  MapPin, PackageCheck, ShieldCheck, Snowflake, Truck,
} from 'lucide-react';

import { fpoInventoryFixture as inventoryData } from '@/data/fixtures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type InventoryTone = 'positive' | 'neutral' | 'warning';
type JourneyState = 'complete' | 'current' | 'upcoming';
type InventoryRecord = Omit<(typeof inventoryData.records)[number], 'tone' | 'journey'> & {
  tone: InventoryTone;
  journey: Array<{ label: string; status: JourneyState; meta: string }>;
};

const records = inventoryData.records as InventoryRecord[];

function statusClass(tone: InventoryTone) {
  return tone === 'positive' ? 'status-positive' : tone === 'warning' ? 'status-warning' : 'status-neutral';
}

export function FpoInventory({ onAction }: { onAction: (message: string) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<InventoryRecord | null>(null);
  const filtered = useMemo(() => records.filter((record) => {
    const matchesQuery = `${record.id} ${record.title} ${record.stage} ${record.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All'
      || (filter === 'Needs action' && record.tone === 'warning')
      || (filter === 'In storage' && record.stage === 'In storage')
      || (filter === 'Buyer allocated' && record.allocation.includes('allocated'));
    return matchesQuery && matchesFilter;
  }), [filter, query]);

  function act(record: InventoryRecord, action: string) {
    onAction(`${action} opened for ${record.id}.`);
  }

  return <>
    <section className="fpo-handover-banner">
      <span className="fpo-handover-icon"><PackageCheck /></span>
      <div><p className="eyebrow">Ownership handover</p><h2>Purchased produce now moves through FPO operations</h2><p>A completed Farmer purchase creates an FPO-owned produce record while preserving its source, assessment and quantity history.</p></div>
    </section>

    <section className="fpo-inventory-summary" aria-label="FPO inventory summary">
      {inventoryData.summary.map((item) => <div className={item.tone ? `is-${item.tone}` : ''} key={item.label}><small>{item.label}</small><strong>{item.value}</strong><span>{item.detail}</span></div>)}
    </section>

    <section className="fpo-inventory-workbench">
      <header className="fpo-inventory-toolbar">
        <div><p className="eyebrow">Produce workbench</p><h2>Owned inventory</h2><p>Place, monitor, allocate, split or dispatch produce after ownership transfer.</p></div>
        <Input aria-label="Search FPO inventory" placeholder="Search produce, source or location" value={query} onChange={(event) => setQuery(event.target.value)} />
      </header>
      <div className="fpo-inventory-filters" aria-label="Inventory filters">
        {['All', 'Needs action', 'In storage', 'Buyer allocated'].map((item) => <button className={cn(filter === item && 'is-active')} aria-pressed={filter === item} key={item} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="fpo-inventory-list">
        {filtered.map((record) => <article className="fpo-inventory-card" key={record.id}>
          <button className="fpo-inventory-card-head" onClick={() => setSelected(record)}>
            <span className="fpo-inventory-crop-icon"><Boxes /></span>
            <span><small>{record.id}</small><strong>{record.title}</strong><em><MapPin />{record.location}</em></span>
            <span className={cn('status-badge', statusClass(record.tone))}>{record.status}</span>
            <ChevronRight />
          </button>
          <div className="fpo-inventory-row-summary">
            <span><small>Owned quantity</small><strong>{record.quantity}</strong></span>
            <span><small>Current stage</small><strong>{record.stage}</strong></span>
            <span><small>Condition</small><strong>{record.conditionScore}% · {record.conditionLabel}</strong></span>
            <Button size="sm" onClick={() => act(record, record.nextAction)}>{record.nextAction}<ArrowRight data-icon="inline-end" /></Button>
          </div>
        </article>)}
      </div>
    </section>

    <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
      <SheetContent className="record-sheet fpo-inventory-sheet" initialFocus={false}>
        {selected && <>
          <SheetHeader className="record-sheet-header">
            <div className="record-sheet-heading"><span className="record-id">{selected.id}</span><span className={cn('status-badge', statusClass(selected.tone))}>{selected.status}</span></div>
            <SheetTitle>{selected.title}</SheetTitle>
            <SheetDescription>{selected.quantity} · {selected.stage}</SheetDescription>
          </SheetHeader>
          <div className="record-sheet-body">
            <section className="ownership-transfer-card"><PackageCheck /><div><small>Current legal owner</small><strong>{selected.owner}</strong><p>Transferred from {selected.acquiredFrom} on {selected.acquiredAt}</p></div></section>
            <section className="detail-section"><h3>Current handling</h3><div className="fpo-inventory-sheet-facts"><span><small>Quality</small><strong><ShieldCheck />{selected.quality}</strong></span><span><small>Storage</small><strong><Snowflake />{selected.storage}</strong></span><span><small>Buyer allocation</small><strong>{selected.allocation}</strong></span></div><div className="fpo-inventory-condition"><span><small>Handling condition</small><strong>{selected.conditionLabel}</strong><em>{selected.conditionBasis}</em></span><b>{selected.conditionScore}%</b><div aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i className={selected.conditionScore > index * 10 ? 'is-filled' : ''} key={index} />)}</div></div></section>
            <section className="detail-section"><h3>Operational journey</h3><ol className="fpo-inventory-journey" aria-label={`${selected.title} operational journey`}>{selected.journey.map((step) => <li className={`is-${step.status}`} key={step.label}>{step.status === 'complete' ? <Check /> : step.status === 'current' ? <Clock3 /> : <Circle />}<span><strong>{step.label}</strong><small>{step.meta}</small></span></li>)}</ol></section>
            <section className="detail-section"><h3>Ownership record</h3><dl className="detail-list"><div><dt>Purchase</dt><dd>{selected.purchaseId}</dd></div><div><dt>Ownership receipt</dt><dd>{selected.ownershipReceipt}</dd></div><div><dt>Source produce</dt><dd>{selected.sourceProduceIds.join(', ')}</dd></div><div><dt>Current location</dt><dd>{selected.location}</dd></div></dl></section>
            <section className="detail-section"><h3>Source lineage</h3><ul className="fpo-lineage-list">{selected.lineage.map((item) => <li key={item}><GitMerge /><span>{item}</span></li>)}</ul></section>
            <section className="detail-section"><h3>Operational actions</h3><div className="fpo-inventory-actions">{selected.actions.map((action) => <Button variant={action === selected.nextAction ? 'default' : 'outline'} key={action} onClick={() => act(selected, action)}>{action}{action.includes('transport') || action.includes('vehicle') ? <Truck /> : <ArrowRight />}</Button>)}</div></section>
          </div>
          <SheetFooter className="record-sheet-footer"><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></SheetFooter>
        </>}
      </SheetContent>
    </Sheet>
  </>;
}
