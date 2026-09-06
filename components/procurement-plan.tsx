'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, FileCheck2, Globe2,
  LockKeyhole, MapPin, PackageCheck, Send, ShieldCheck, Users,
} from 'lucide-react';

import { procurementPlanFixture as planData } from '@/data/fixtures';
import type { CreatedAgreement, RequirementSourcing } from '@/components/prototype-store';
import { VerifiedIdentity } from '@/components/verified-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PlanStep = 'bid' | 'recipients' | 'responses' | 'complete';
type Match = (typeof planData.matches)[number];
type Response = (typeof planData.responses)[number];
type Visibility = 'public' | 'private';
type RequirementSummary = {
  id: string; visibility: Visibility; title: string; crop: string; quantity: number;
  tolerance: string; price: string; delivery: string; requiredBy: string;
  responseDeadline: string; status: string; pendingOffers: number; gatheredQuantity: number;
};

const initialRequestQuantities = Object.fromEntries(planData.matches.map((match) => [match.id, match.available]));

function formatKg(value: number) { return `${value.toLocaleString('en-IN')} kg`; }

function SelectionMark({ selected, locked = false }: { selected: boolean; locked?: boolean }) {
  return <span className={cn('selection-box', selected && 'is-selected', locked && 'is-locked')}>{selected && (locked ? <LockKeyhole /> : <Check />)}</span>;
}

function RequirementStrip({ requirement, committed }: { requirement: RequirementSummary; committed: number }) {
  const isPrivate = requirement.visibility === 'private';
  return (
    <section className="plan-requirement-strip">
      <div><span className="role-icon">{isPrivate ? <LockKeyhole /> : <Globe2 />}</span><span><small>{isPrivate ? 'Private direct offer' : 'Public requirement'} · {requirement.id}</small><strong>{requirement.title}</strong></span></div>
      <dl>
        <div><dt>Required</dt><dd>{formatKg(requirement.quantity)}</dd></div>
        <div><dt>{isPrivate ? 'Committed on acceptance' : 'Buyer awarded'}</dt><dd>{formatKg(committed)}</dd></div>
        <div><dt>Delivery</dt><dd>{requirement.requiredBy} · {requirement.delivery}</dd></div>
        <div><dt>{isPrivate ? 'Accept by' : 'Proposals close'}</dt><dd>{requirement.responseDeadline}</dd></div>
      </dl>
    </section>
  );
}

function MatchRow({ match, selected, quantity, onToggle, onQuantity }: {
  match: Match; selected: boolean; quantity: number; onToggle: () => void; onQuantity: (quantity: number) => void;
}) {
  return (
    <article className={cn('recipient-row', selected && 'is-selected')}>
      <button type="button" className="recipient-select" onClick={onToggle} aria-pressed={selected}>
        <SelectionMark selected={selected} />
        <span className="recipient-identity"><VerifiedIdentity name={match.seller} as="strong" /><small>{match.sellerType} · {match.produceId} · {match.grade}</small></span>
      </button>
      <div className="recipient-context"><span><MapPin />{match.location} · {match.distance}</span><span><ShieldCheck />Reliability {match.reliability}</span></div>
      <div className="recipient-match"><strong>{match.match} match</strong><small>{match.reasons.join(' · ')}</small></div>
      <div className="recipient-quantity">
        <label htmlFor={`request-${match.id}`}>Maximum offered</label>
        <div><Input id={`request-${match.id}`} type="number" min="0" max={match.available} value={quantity} disabled={!selected} onChange={(event) => onQuantity(Math.min(match.available, Math.max(0, Number(event.target.value))))} /><span>kg</span></div>
        <small>Seller may accept all or part of this amount</small>
      </div>
    </article>
  );
}

function ResponseRow({ mode, response, match, selected, allocation, remaining, onToggle, onAllocation, onAcceptCounter }: {
  mode: Visibility; response: Response; match: Match; selected: boolean; allocation: number; remaining: number;
  onToggle: () => void; onAllocation: (quantity: number) => void; onAcceptCounter: () => void;
}) {
  const committed = response.status === 'Committed' || response.status === 'Partially committed';
  const alreadyAwarded = response.status === 'Awarded';
  const counter = response.status === 'Counteroffer';
  const unavailable = response.status === 'Declined' || response.status === 'Pending' || response.status === 'Requirement filled';
  const locked = committed || alreadyAwarded;
  const tone = counter ? 'warning' : unavailable ? 'neutral' : 'positive';
  return (
    <article className={cn('response-row', (selected || locked) && 'is-awarded', unavailable && 'is-declined')}>
      <div className="response-head">
        <button type="button" onClick={mode === 'public' && !locked && !unavailable ? onToggle : undefined} disabled={mode === 'private' || locked || unavailable} aria-pressed={selected || locked}>
          <SelectionMark selected={selected || locked} locked={locked} />
          <span><VerifiedIdentity name={match.seller} as="strong" /><small>{match.sellerType} · {match.produceId}</small></span>
        </button>
        <span className={cn('status-badge', `status-${tone}`)}>{response.status}</span>
      </div>
      <div className="response-terms">
        <span><small>{mode === 'private' ? counter ? 'Counter quantity' : committed ? 'Committed quantity' : 'Response quantity' : 'Proposed quantity'}</small><strong>{formatKg(response.quantity)}</strong></span>
        <span><small>Price</small><strong>{response.price ? `₹${response.price.toFixed(2)}/kg` : '—'}</strong></span>
        <span><small>Payment</small><strong>{response.payment}</strong></span>
        <span><small>Valid until</small><strong>{response.validUntil}</strong></span>
      </div>
      <p>{response.note}</p>
      {mode === 'public' && !unavailable && !alreadyAwarded && (
        <div className="award-control">
          <label htmlFor={`award-${match.id}`}>Quantity to award</label>
          <div><Input id={`award-${match.id}`} type="number" min="0" max={Math.min(response.quantity, remaining + allocation)} value={allocation} disabled={!selected} onChange={(event) => onAllocation(Math.min(response.quantity, Math.max(0, Number(event.target.value))))} /><span>kg</span></div>
          {counter && selected && <small>Awarding accepts this seller’s counter terms for the entered quantity.</small>}
        </div>
      )}
      {mode === 'private' && counter && !selected && remaining > 0 && (
        <div className="private-counter-action"><span><strong>Counter does not reserve produce</strong><small>Accepting commits up to the {formatKg(remaining)} still required.</small></span><Button size="sm" onClick={onAcceptCounter}>Accept counter for {formatKg(Math.min(response.quantity, remaining))}</Button></div>
      )}
      {mode === 'private' && counter && selected && <aside className="locked-allocation"><LockKeyhole />Counter accepted · {formatKg(allocation)} committed and seller locked</aside>}
    </article>
  );
}

export function ProcurementPlanDialog({ open, onOpenChange, onComplete, requirements, requirementId, onRequestSent, onSourcingUpdate }: {
  open: boolean; onOpenChange: (open: boolean) => void; onComplete: (message: string) => void;
  requirements: CreatedAgreement[]; requirementId: string;
  onRequestSent: (requirementId: string, pendingOffers: number) => void;
  onSourcingUpdate: (requirementId: string, sourcing: RequirementSourcing) => void;
}) {
  const createdRequirements: RequirementSummary[] = requirements.filter((item) => item.actor === 'buyer' && item.status !== 'Draft').map((item) => ({
    id: item.id, visibility: item.visibility, title: `${item.crop} · ${item.grade}`, crop: item.crop,
    quantity: Number(item.quantity), tolerance: item.terms.quantity_tolerance || 'No tolerance', price: `₹${item.price}/kg`,
    delivery: item.deliveryLocation, requiredBy: item.deliveryDate, responseDeadline: item.expiry,
    status: item.status, pendingOffers: 0, gatheredQuantity: 0,
  }));
  const availableRequirements = useMemo(() => [...createdRequirements, ...(planData.buyerRequirements as RequirementSummary[])], [createdRequirements]);
  const initialRequirementId = availableRequirements.some((item) => item.id === requirementId) ? requirementId : availableRequirements[0].id;
  const [step, setStep] = useState<PlanStep>('bid');
  const [selectedRequirementId, setSelectedRequirementId] = useState(initialRequirementId);
  const [selectionMode, setSelectionMode] = useState('Top 5 matches');
  const [recipients, setRecipients] = useState(() => new Set(planData.matches.filter((match) => match.bidId === initialRequirementId).map((match) => match.id)));
  const [requestQuantities, setRequestQuantities] = useState<Record<string, number>>(initialRequestQuantities);
  const [selectedPublicAwards, setSelectedPublicAwards] = useState<Set<string>>(new Set());
  const [awardQuantities, setAwardQuantities] = useState<Record<string, number>>({});
  const [acceptedCounters, setAcceptedCounters] = useState<Set<string>>(new Set());

  const requirement = availableRequirements.find((item) => item.id === selectedRequirementId) ?? availableRequirements[0];
  const matches = planData.matches.filter((match) => match.bidId === requirement.id || (requirement.id.startsWith('REQ-DEMO') && match.crop === requirement.crop));
  const selectedMatches = matches.filter((match) => recipients.has(match.id));
  const responses = planData.responses.filter((response) => matches.some((match) => match.id === response.matchId));
  const baseCommittedResponses = responses.filter((response) => requirement.visibility === 'private'
    ? response.status === 'Committed' || response.status === 'Partially committed'
    : response.status === 'Awarded');
  const baseCommitted = baseCommittedResponses.reduce((sum, response) => sum + response.quantity, 0);
  const counterCommitments = responses.filter((response) => acceptedCounters.has(response.matchId));
  const counterCommitted = counterCommitments.reduce((sum, response) => sum + (awardQuantities[response.matchId] ?? 0), 0);
  const newPublicAwards = responses.filter((response) => selectedPublicAwards.has(response.matchId));
  const publicAwarded = newPublicAwards.reduce((sum, response) => sum + (awardQuantities[response.matchId] ?? 0), 0);
  const committed = baseCommitted + (requirement.visibility === 'private' ? counterCommitted : publicAwarded);
  const quantityGap = requirement.quantity - committed;
  const remaining = Math.max(0, quantityGap);
  const pendingCount = responses.filter((response) => response.status === 'Pending').length;
  const potentialQuantity = selectedMatches.reduce((sum, match) => sum + requestQuantities[match.id], 0);
  const finalResponses = [...baseCommittedResponses, ...(requirement.visibility === 'private' ? counterCommitments : newPublicAwards)];

  function chooseRequirement(id: string) {
    const next = availableRequirements.find((item) => item.id === id) ?? availableRequirements[0];
    const nextMatches = planData.matches.filter((match) => match.bidId === next.id || (next.id.startsWith('REQ-DEMO') && match.crop === next.crop));
    setSelectedRequirementId(next.id);
    setRecipients(new Set(nextMatches.map((match) => match.id)));
    setSelectionMode(nextMatches.length > 3 ? 'Top 5 matches' : 'Top 3 matches');
    setSelectedPublicAwards(new Set()); setAwardQuantities({}); setAcceptedCounters(new Set());
  }

  function selectPreset(mode: string) {
    setSelectionMode(mode);
    if (mode === 'Top 5 matches') setRecipients(new Set(matches.slice(0, 5).map((match) => match.id)));
    if (mode === 'Top 3 matches') setRecipients(new Set(matches.slice(0, 3).map((match) => match.id)));
  }

  function toggleRecipient(matchId: string) {
    setSelectionMode('Manual selection');
    setRecipients((current) => { const next = new Set(current); if (next.has(matchId)) next.delete(matchId); else next.add(matchId); return next; });
  }

  function togglePublicAward(response: Response) {
    setSelectedPublicAwards((current) => { const next = new Set(current); if (next.has(response.matchId)) next.delete(response.matchId); else next.add(response.matchId); return next; });
    if (!awardQuantities[response.matchId]) setAwardQuantities((current) => ({ ...current, [response.matchId]: Math.min(response.quantity, remaining) }));
  }

  function acceptPrivateCounter(response: Response) {
    const quantity = Math.min(response.quantity, remaining);
    setAwardQuantities((current) => ({ ...current, [response.matchId]: quantity }));
    setAcceptedCounters((current) => new Set([...current, response.matchId]));
  }

  function finishRequirement() {
    setStep('complete');
    onSourcingUpdate(requirement.id, { pendingOffers: 0, gatheredQuantity: committed });
    onComplete(requirement.visibility === 'private'
      ? `${requirement.id} filled; ${formatKg(committed)} committed and remaining invitations closed.`
      : `${requirement.id} awarded; ${formatKg(committed)} committed across ${finalResponses.length} sellers.`);
  }

  function resetPlan() { chooseRequirement(initialRequirementId); setStep('bid'); }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="procurement-plan-dialog" showCloseButton>
        <DialogHeader className="procurement-plan-head">
          <div><span className="dialog-icon"><Users /></span><span><p className="eyebrow">Buyer sourcing control</p><DialogTitle>Manage requirement responses</DialogTitle></span></div>
          <DialogDescription>Public requirements collect proposals for Buyer award. Private direct offers reserve accepted quantities immediately.</DialogDescription>
          <ol className="plan-steps" aria-label="Requirement management steps">
            <li className={cn(step === 'bid' ? 'is-current' : 'is-complete')}><span>{step === 'bid' ? 1 : <Check />}</span><small>Requirement</small></li>
            <li className={cn(step === 'recipients' && 'is-current', (step === 'responses' || step === 'complete') && 'is-complete')}><span>{step === 'responses' || step === 'complete' ? <Check /> : 2}</span><small>{requirement.visibility === 'private' ? 'Recipients' : 'Proposals'}</small></li>
            <li className={cn(step === 'responses' && 'is-current', step === 'complete' && 'is-complete')}><span>{step === 'complete' ? <Check /> : 3}</span><small>{requirement.visibility === 'private' ? 'Commitments' : 'Awards'}</small></li>
            <li className={cn(step === 'complete' && 'is-current')}><span>4</span><small>Trades</small></li>
          </ol>
        </DialogHeader>
        <div className="procurement-plan-body">
          {step !== 'bid' && <RequirementStrip requirement={requirement} committed={committed} />}
          {step === 'bid' && (
            <div className="bid-picker-layout">
              <main className="bid-picker-main">
                <div className="plan-section-head"><div><h3>Choose a published requirement</h3><p>The next steps change according to its public or private sourcing mode.</p></div><span><PackageCheck />{availableRequirements.length} requirements</span></div>
                <div className="private-bid-list">{availableRequirements.map((item) => (
                  <button type="button" className={cn('private-bid-option', selectedRequirementId === item.id && 'is-selected')} onClick={() => chooseRequirement(item.id)} aria-pressed={selectedRequirementId === item.id} key={item.id}>
                    <SelectionMark selected={selectedRequirementId === item.id} />
                    <span className="private-bid-name"><small>{item.id} · {item.visibility === 'private' ? 'Private direct offer' : 'Public requirement'}</small><strong>{item.title}</strong><em>{item.delivery}</em></span>
                    <span><small>Required</small><strong>{formatKg(item.quantity)}</strong><em>{item.price} · {item.tolerance}</em></span>
                    <span><small>{item.visibility === 'private' ? 'Accept by' : 'Proposals close'}</small><strong>{item.responseDeadline}</strong><em>Delivery {item.requiredBy}</em></span>
                    <span><small>{item.visibility === 'private' ? 'Committed' : 'Awarded'}</small><strong>{formatKg(item.gatheredQuantity)}</strong><em>{item.pendingOffers} pending</em></span><ArrowRight />
                  </button>
                ))}</div>
              </main>
              <aside className="plan-summary selected-bid-summary">
                <p className="eyebrow">Selected sourcing mode</p><span className="selected-bid-id">{requirement.visibility === 'private' ? <LockKeyhole /> : <Globe2 />}{requirement.id}</span>
                <h3>{requirement.visibility === 'private' ? 'Invite, accept and reserve' : 'Collect, compare and award'}</h3>
                <p>{requirement.visibility === 'private' ? 'Invited sellers commit quantity when they accept. The Buyer cannot replace accepted sellers.' : 'Eligible sellers submit proposals. Only quantities explicitly awarded by the Buyer become trades.'}</p>
                <dl><div><dt>Required</dt><dd>{formatKg(requirement.quantity)}</dd></div><div><dt>Terms</dt><dd>{requirement.price}</dd></div><div><dt>Destination</dt><dd>{requirement.delivery}</dd></div><div><dt>Deadline</dt><dd>{requirement.responseDeadline}</dd></div></dl>
                <Button size="lg" onClick={() => setStep(requirement.visibility === 'private' ? 'recipients' : 'responses')}>{requirement.visibility === 'private' ? 'Choose private recipients' : 'Review public proposals'}<ArrowRight data-icon="inline-end" /></Button>
              </aside>
            </div>
          )}
          {step === 'recipients' && (
            <div className="plan-workspace">
              <main className="plan-main">
                <div className="plan-section-head"><div><h3>Select private recipients</h3><p>Every selected seller receives the same direct terms and a maximum quantity they may accept.</p></div><span><LockKeyhole />Private direct offer</span></div>
                <div className="recipient-presets" aria-label="Recipient selection mode">{['Top 5 matches', 'Top 3 matches', 'Manual selection'].map((mode) => <button type="button" className={cn(selectionMode === mode && 'is-active')} onClick={() => selectPreset(mode)} key={mode}>{mode}</button>)}</div>
                <div className="selected-bid-callout"><LockKeyhole /><span><small>Sending direct offers for</small><strong>{requirement.id} · {requirement.title}</strong></span><Button variant="ghost" size="sm" onClick={() => setStep('bid')}>Change requirement</Button></div>
                <div className="recipient-list">{matches.map((match) => <MatchRow key={match.id} match={match} selected={recipients.has(match.id)} quantity={requestQuantities[match.id]} onToggle={() => toggleRecipient(match.id)} onQuantity={(quantity) => setRequestQuantities((current) => ({ ...current, [match.id]: quantity }))} />)}</div>
              </main>
              <aside className="plan-summary">
                <p className="eyebrow">Direct-offer summary</p><h3>{selectedMatches.length} selected sellers</h3>
                <dl><div><dt>Requirement</dt><dd>{formatKg(requirement.quantity)}</dd></div><div><dt>Potential acceptance</dt><dd>{formatKg(potentialQuantity)}</dd></div><div><dt>Terms</dt><dd>{requirement.price}</dd></div><div><dt>Accept by</dt><dd>{requirement.responseDeadline}</dd></div></dl>
                <div className="coverage-note"><ShieldCheck /><span><strong>{potentialQuantity >= requirement.quantity ? 'Enough invited capacity' : `${formatKg(requirement.quantity - potentialQuantity)} not covered`}</strong><small>Accepted quantities reserve immediately. Later acceptances are limited by the remaining requirement.</small></span></div>
                <Button size="lg" disabled={selectedMatches.length === 0} onClick={() => { const pendingInvitations = responses.filter((response) => recipients.has(response.matchId) && response.status === 'Pending').length; onRequestSent(requirement.id, pendingInvitations); setStep('responses'); }}><Send />Send direct offers to {selectedMatches.length}</Button>
              </aside>
            </div>
          )}
          {step === 'responses' && (
            <div className="plan-workspace">
              <main className="plan-main">
                <div className="plan-section-head"><div><h3>{requirement.visibility === 'private' ? 'Accepted commitments and counters' : 'Compare proposals and award quantities'}</h3><p>{requirement.visibility === 'private' ? 'Accepted sellers are locked. Only counters need a Buyer decision.' : 'Seller proposals do not reserve produce until you award an exact quantity.'}</p></div><span><Clock3 />{responses.length - pendingCount} responded · {pendingCount} pending</span></div>
                <div className="response-list">{responses.map((response) => { const match = matches.find((item) => item.id === response.matchId)!; return <ResponseRow key={response.matchId} mode={requirement.visibility} response={response} match={match} selected={requirement.visibility === 'private' ? acceptedCounters.has(response.matchId) : selectedPublicAwards.has(response.matchId)} allocation={awardQuantities[response.matchId] ?? 0} remaining={remaining} onToggle={() => togglePublicAward(response)} onAllocation={(quantity) => setAwardQuantities((current) => ({ ...current, [response.matchId]: Math.min(quantity, remaining + (current[response.matchId] ?? 0)) }))} onAcceptCounter={() => acceptPrivateCounter(response)} />; })}</div>
              </main>
              <aside className="plan-summary award-summary">
                <p className="eyebrow">{requirement.visibility === 'private' ? 'Live commitment' : 'Award summary'}</p><h3>{finalResponses.length} sellers committed</h3>
                <div className={cn('award-total', quantityGap === 0 && 'is-ready')}><small>{requirement.visibility === 'private' ? 'Accepted and locked' : 'Total awarded'}</small><strong>{formatKg(committed)}</strong><span>{quantityGap === 0 ? 'Exact requirement met' : quantityGap < 0 ? `${formatKg(Math.abs(quantityGap))} over target` : `${formatKg(remaining)} still required`}</span></div>
                <dl><div><dt>Seller control</dt><dd>{requirement.visibility === 'private' ? 'Locked after acceptance' : 'Buyer selects awards'}</dd></div><div><dt>Trades</dt><dd>{finalResponses.length}</dd></div><div><dt>Unselected responses</dt><dd>{remaining === 0 ? requirement.visibility === 'private' ? 'Closed: requirement filled' : 'Not awarded' : 'Remain open'}</dd></div></dl>
                <div className="award-actions"><Button variant="outline" onClick={() => setStep(requirement.visibility === 'private' ? 'recipients' : 'bid')}><ArrowLeft />Back</Button><Button size="lg" disabled={quantityGap !== 0 || finalResponses.length === 0} onClick={finishRequirement}>{requirement.visibility === 'private' ? 'Close filled requirement' : 'Confirm awards'}<ArrowRight data-icon="inline-end" /></Button></div>
              </aside>
            </div>
          )}
          {step === 'complete' && (
            <section className="plan-complete">
              <span className="completion-icon"><CheckCircle2 /></span><p className="eyebrow">Requirement filled</p><h2>{finalResponses.length} separate trades confirmed</h2><p>{formatKg(committed)} is committed against {requirement.id}. {requirement.visibility === 'private' ? 'Accepted sellers remain fixed and outstanding invitations are closed as requirement filled.' : 'Unselected public proposals are marked not awarded.'}</p>
              <div className="created-trades">{finalResponses.map((response, index) => { const match = matches.find((item) => item.id === response.matchId)!; const quantity = response.status === 'Awarded' || response.status.includes('committed') || response.status === 'Committed' ? response.quantity : awardQuantities[response.matchId]; return <article key={response.matchId}><span><small>TR-DEMO-{1046 + index}</small><VerifiedIdentity name={match.seller} as="strong" /><em>{match.produceId}</em></span><span><small>Committed</small><strong>{formatKg(quantity)}</strong><em>₹{response.price.toFixed(2)}/kg</em></span><span><small>Source</small><strong>{requirement.visibility === 'private' ? 'Accepted direct offer' : 'Buyer award'}</strong><em>Terms frozen separately</em></span><FileCheck2 /></article>; })}</div>
              <aside><LockKeyhole />Each seller fulfils its own frozen trade and transfers produce according to that trade’s delivery and ownership terms.</aside>
              <div><Button variant="outline" onClick={resetPlan}>Manage another requirement</Button><Button onClick={() => onOpenChange(false)}>View purchases<ArrowRight data-icon="inline-end" /></Button></div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
