'use client';

import {
  ArrowRight, Check, ChevronRight, ClipboardCheck, Clock3, IndianRupee, Leaf, MapPin,
  LockKeyhole, PackageCheck, ShieldCheck, Thermometer, Truck, Users,
} from 'lucide-react';

import { roleOverviewFixture as overviewData } from '@/data/fixtures';
import { Button } from '@/components/ui/button';
import { VerifiedIdentity } from '@/components/verified-badge';
import { cn } from '@/lib/utils';

type RoleId = keyof typeof overviewData;
type Tone = 'neutral' | 'positive' | 'warning';

function Status({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={cn('status-badge', `status-${tone}`)}>{children}</span>;
}

function PanelTitle({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="panel-header">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {action && <button onClick={onAction}>{action}<ArrowRight /></button>}
    </div>
  );
}

function FarmerOverview({ onAction, onNavigate, onOpenAgreement }: OverviewProps) {
  const data = overviewData.farmer;
  return (
    <div className="role-overview farmer-overview">
      <section className="farmer-alert">
        <span className="role-icon"><Clock3 /></span>
        <div><strong>{data.urgent.title}</strong><p>{data.urgent.detail}</p></div>
        <Button onClick={() => onNavigate('Offers')}>{data.urgent.action}<ArrowRight data-icon="inline-end" /></Button>
      </section>

      <section className="farmer-main-grid">
        <article className="panel farmer-produce-card">
          <PanelTitle eyebrow="Ready to sell" title="Your active produce" action="View all produce" onAction={() => onNavigate('Produce')} />
          <div className="farmer-crop">
            <span className="crop-mark"><Leaf /></span>
            <div className="crop-title"><h3>{data.produce.crop}</h3><p>{data.produce.id} · {data.produce.location}</p></div>
            <Status tone="positive">{data.produce.marketStatus}</Status>
          </div>
          <div className="crop-facts"><span><small>Available</small><strong>{data.produce.quantity}</strong></span><span><small>Quality</small><strong>{data.produce.grade}</strong></span><span><small>Current produce stage</small><strong>{data.produce.stage}</strong></span></div>
          <div className="produce-lifecycle-head"><span>Produce journey</span><strong>4 of 8 stages</strong></div>
          <div className="farmer-steps-scroll"><ol className="farmer-steps">{data.produceLifecycle.map((step, index) => <li className={cn(step.state === 'complete' && 'is-complete', step.state === 'current' && 'is-current')} key={step.label}><span>{step.state === 'complete' ? <Check /> : index + 1}</span><small>{step.label}</small></li>)}</ol></div>
        </article>

        <article className="panel decision-card">
          <PanelTitle eyebrow="Decision support" title="Sell now or wait?" />
          <div className="scenario-list">{data.sellScenarios.map((scenario) => (
            <button className={cn('scenario-row', scenario.recommended && 'is-recommended')} key={scenario.label} onClick={() => onAction(`${scenario.label} scenario opened.`)}>
              <span><strong>{scenario.label}</strong><small>{scenario.detail}</small></span><b>{scenario.value}</b>{scenario.recommended && <Status tone="positive">Recommended</Status>}
            </button>
          ))}</div>
          <p className="context-note"><IndianRupee />Net values include the listed transport, storage and market costs.</p>
        </article>
      </section>

      <section className="panel farmer-offers">
        <PanelTitle eyebrow="Competitive offer window" title="Offers ranked for your return" action="Compare full terms" onAction={() => onNavigate('Offers')} />
        <div className="offer-cards">{data.offers.map((offer, index) => (
          <button className={cn('offer-card', index === 0 && 'is-best')} key={offer.id} onClick={() => onOpenAgreement?.(offer.id)}>
            <span className="offer-rank">#{index + 1}</span><Status tone={offer.tone as Tone}>{offer.tag}</Status>
            <VerifiedIdentity name={offer.buyer} as="h3" /><p>{offer.terms}</p>
            <div><span><small>Price</small><strong>{offer.price}</strong></span><span><small>Expected net</small><strong>{offer.net}</strong></span></div>
          </button>
        ))}</div>
      </section>
    </div>
  );
}

function FpoOverview({ onNavigate }: OverviewProps) {
  const data = overviewData.fpo;
  return (
    <div className="role-overview fpo-overview">
      <section className="fpo-home-focus">
        <div><p className="eyebrow">Priority campaign · {data.campaign.id}</p><h2>{data.campaign.name}</h2><p><VerifiedIdentity name={data.campaign.buyer} /> · {data.campaign.deadline}</p></div>
        <span><small>Reserved</small><strong>16.4T</strong><em>of {data.campaign.target}</em></span>
        <span className="is-warning"><small>Still required</small><strong>3.6T</strong><em>before commitment closes</em></span>
        <Button onClick={() => onNavigate('Campaigns')}>Open procurement<ArrowRight data-icon="inline-end" /></Button>
      </section>

      <section className="fpo-home-grid">
        <article className="panel fpo-action-queue">
          <PanelTitle eyebrow="Today" title="Work needing attention" />
          <button onClick={() => onNavigate('Campaigns')}><span className="role-icon"><Users /></span><span><strong>Secure remaining onion supply</strong><small>{data.campaign.id} · 3.6T shortfall</small></span><Status tone="warning">Due first</Status><ChevronRight /></button>
          <button onClick={() => onNavigate('Farmer supply')}><span className="role-icon"><ClipboardCheck /></span><span><strong>Review Farmer collections</strong><small>{data.reservations.length} grouped reservations</small></span><Status tone="neutral">Needs review</Status><ChevronRight /></button>
          <button onClick={() => onNavigate('Inventory')}><span className="role-icon"><PackageCheck /></span><span><strong>Place newly purchased produce</strong><small>4,280 kg onion · ownership received</small></span><Status tone="warning">Storage due</Status><ChevronRight /></button>
        </article>

        <article className="panel economics-card fpo-home-economics">
          <PanelTitle eyebrow="Priority campaign" title="Commercial snapshot" action="Buyer terms" onAction={() => onNavigate('Open demand')} />
          <dl>{data.economics.map((item, index) => <div className={cn(index === data.economics.length - 1 && 'is-total')} key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
          <p className="context-note"><ShieldCheck />Detailed sourcing, reservations and terms remain available in their workspaces.</p>
        </article>
      </section>
    </div>
  );
}

function BuyerOverview({ onNavigate }: OverviewProps) {
  const data = overviewData.buyer;
  return (
    <div className="role-overview buyer-overview">
      <section className="panel requirement-hero">
        <div className="requirement-heading"><span className="role-icon"><PackageCheck /></span><div><p className="eyebrow">Active requirement · {data.requirement.id}</p><h2>{data.requirement.name}</h2><p>{data.requirement.destination} · {data.requirement.delivery}</p></div><Button variant="outline" onClick={() => onNavigate('Requirements')}>Manage requirement</Button></div>
        <div className="fulfilment-flow">{data.fulfilment.map((stage, index) => <div className="fulfilment-stage" key={stage.label}><span className="flow-index">{index + 1}</span><small>{stage.label}</small><strong>{stage.value}</strong></div>)}</div>
      </section>
      <section className="buyer-layout">
        <article className="panel supply-plan">
          <PanelTitle eyebrow="Private direct offer" title="Accepted supply and pending responses" action="Manage sourcing" onAction={() => onNavigate('Requirements')} />
          <div className="supply-plan-list">{data.supplyPlan.map((produce) => <button key={produce.produce} onClick={() => onNavigate('Requirements')}><span className={cn('selection-box', produce.selected && 'is-locked')}>{produce.selected ? <LockKeyhole /> : <Clock3 />}</span><span><VerifiedIdentity name={produce.seller} as="strong" /><small>{produce.produce} · {produce.quality}</small></span><span><small>{produce.selected ? 'Committed' : 'Offered'}</small><strong>{produce.quantity}</strong></span><span><small>Landed</small><strong>{produce.landed}</strong></span><ChevronRight /></button>)}</div>
        </article>
        <article className="panel buyer-costs">
          <PanelTitle eyebrow="Decision total" title="Landed cost" />
          <dl>{data.costs.map((cost, index) => <div className={cn(index === data.costs.length - 1 && 'is-total')} key={cost.label}><dt>{cost.label}</dt><dd>{cost.value}</dd></div>)}</dl>
          <Status tone="positive">Within {data.requirement.budget} budget</Status>
        </article>
      </section>
      <section className="arrival-strip"><span className="role-icon"><Truck /></span><div><small>Receiving now</small><strong><VerifiedIdentity name={data.arrival.seller} /> · {data.arrival.quantity}</strong><p>{data.arrival.time}</p></div><Button onClick={() => onNavigate('Deliveries')}>{data.arrival.action}<ArrowRight data-icon="inline-end" /></Button></section>
    </div>
  );
}

function StorageOverview({ onAction, onNavigate }: OverviewProps) {
  const data = overviewData.storage;
  return (
    <div className="role-overview storage-overview">
      <section className="panel capacity-board">
        <PanelTitle eyebrow="Space control" title="Capacity by facility" action="Manage facilities" onAction={() => onNavigate('Facilities')} />
        <div className="capacity-legend"><span className="available">Available</span><span className="held">Held</span><span className="reserved">Reserved</span><span className="occupied">Occupied</span></div>
        <div className="facility-capacity-list">{data.facilities.map((facility) => <button key={facility.name} onClick={() => onAction(`${facility.name} opened.`)}><span><strong>{facility.name}</strong><small>{facility.range} · {facility.total}</small></span><span className="capacity-stack">{(['available','held','reserved','occupied'] as const).map((key) => <i className={key} style={{ '--segment': `${facility[key]}%` } as React.CSSProperties} key={key} />)}</span><b>{facility.available}% free</b><ChevronRight /></button>)}</div>
      </section>
      <section className="storage-grid">
        <article className="panel dock-schedule"><PanelTitle eyebrow="Dock operations" title="Today’s movements" action="All bookings" onAction={() => onNavigate('Bookings')} /><div>{data.schedule.map((item) => <button key={`${item.time}-${item.crop}`} onClick={() => onAction(`${item.type} opened.`)}><time>{item.time}</time><span className={cn('movement-type', item.type === 'Check-in' ? 'incoming' : 'outgoing')}>{item.type}</span><span><strong>{item.crop}</strong><small>{item.party}</small></span><span><strong>{item.dock}</strong><small>{item.state}</small></span></button>)}</div></article>
        <div className="storage-side">
          <article className="panel condition-panel"><PanelTitle eyebrow="Condition monitoring" title="Rooms" />{data.conditions.map((room) => <button key={room.room} onClick={() => onAction(`${room.room} conditions opened.`)}><Thermometer /><span><strong>{room.room}</strong><small>{room.detail}</small></span><b>{room.value}</b><Status tone={room.tone as Tone}>{room.tone === 'warning' ? 'Alert' : 'Live'}</Status></button>)}</article>
          <article className="panel quote-mini"><PanelTitle eyebrow="Sales queue" title="Quote requests" action="View all" onAction={() => onNavigate('Requests')} />{data.quotes.map((quote) => <button key={`${quote.crop}-${quote.capacity}`} onClick={() => onNavigate('Requests')}><span><strong>{quote.crop}</strong><small>{quote.capacity} · {quote.requester}</small></span><b>{quote.due}</b></button>)}</article>
        </div>
      </section>
    </div>
  );
}

function TransportOverview({ onAction, onNavigate }: OverviewProps) {
  const data = overviewData.transport;
  return (
    <div className="role-overview transport-overview">
      <section className="dispatch-layout">
        <article className="panel active-route">
          <PanelTitle eyebrow={`Live shipment · ${data.route.id}`} title={`${data.route.load} to ${data.route.destination}`} action="Open route" onAction={() => onNavigate('Routes')} />
          <div className="vehicle-strip"><Truck /><span><small>Vehicle</small><strong>{data.route.vehicle}</strong></span><span><small>Driver</small><strong>{data.route.driver}</strong></span><span><small>Estimated arrival</small><strong>{data.route.eta}</strong></span><Status tone="positive">On schedule</Status></div>
          <ol className="route-line">{data.stops.map((stop, index) => <li className={cn(stop.state === 'Complete' && 'is-complete', stop.state === 'Loading' && 'is-current')} key={`${stop.time}-${stop.place}`}><span className="route-node">{stop.state === 'Complete' ? <Check /> : index + 1}</span><time>{stop.time}</time><strong>{stop.place}</strong><small>{stop.detail} · {stop.state}</small></li>)}</ol>
          <Button onClick={() => onAction('Driver update requested.')}>Message driver<ArrowRight data-icon="inline-end" /></Button>
        </article>
        <article className="panel fleet-board"><PanelTitle eyebrow="Fleet status" title="Vehicles" action="Manage fleet" onAction={() => onNavigate('Vehicles')} /><div className="fleet-list">{data.fleet.map((vehicle) => <button key={vehicle.vehicle} onClick={() => onAction(`${vehicle.vehicle} opened.`)}><span className="vehicle-symbol"><Truck /></span><span><strong>{vehicle.vehicle}</strong><small>{vehicle.type} · {vehicle.driver}</small></span><Status tone={vehicle.tone as Tone}>{vehicle.state}</Status></button>)}</div></article>
      </section>
      <section className="panel transport-quotes"><PanelTitle eyebrow="Unassigned work" title="Quote opportunities" action="Open quote desk" onAction={() => onNavigate('Quote requests')} /><div>{data.quotes.map((quote) => <button key={quote.route} onClick={() => onNavigate('Quote requests')}><MapPin /><span><strong>{quote.route}</strong><small>{quote.load}</small></span><b>{quote.value}</b><Status tone="warning">{quote.due}</Status><ArrowRight /></button>)}</div></section>
    </div>
  );
}

function QualityOverview({ onAction, onNavigate }: OverviewProps) {
  const data = overviewData.quality;
  return (
    <div className="role-overview quality-overview">
      <section className="quality-layout">
        <article className="panel field-schedule"><PanelTitle eyebrow={data.day} title="Field schedule" action="Full calendar" onAction={() => onNavigate('Schedule')} /><ol>{data.schedule.map((visit) => <li key={`${visit.time}-${visit.produce}`}><time>{visit.time}</time><span className="schedule-line" /><button onClick={() => onAction(`${visit.produce} visit opened.`)}><span><strong>{visit.crop}</strong><small>{visit.produce} · {visit.place}</small></span><Status tone={visit.tone as Tone}>{visit.state}</Status><ChevronRight /></button></li>)}</ol></article>
        <article className="panel assessment-workbench"><PanelTitle eyebrow="Field workbench" title={`${data.active.crop} assessment`} action="New requests" onAction={() => onNavigate('Requests')} /><div className="assessment-context"><span><small>Produce</small><strong>{data.active.produce}</strong></span><span><small>Farmer</small><VerifiedIdentity name={data.active.farmer} as="strong" /></span><b>Step 3 of 5</b></div><ol className="assessment-checklist">{data.checklist.map((step, index) => <li className={cn(step.state === 'Complete' && 'is-complete', step.state === 'Current' && 'is-current')} key={step.label}><span>{step.state === 'Complete' ? <Check /> : index + 1}</span><strong>{step.label}</strong><small>{step.state}</small></li>)}</ol><Button size="lg" onClick={() => onNavigate('Assessments')}>Continue assessment<ArrowRight data-icon="inline-end" /></Button></article>
      </section>
      <section className="panel report-deadlines"><PanelTitle eyebrow="Report handoff" title="Drafts and re-checks" action="All reports" onAction={() => onNavigate('Reports')} /><div>{data.reports.map((report) => <button key={report.produce} onClick={() => onAction(`${report.produce} report opened.`)}><ClipboardCheck /><span><strong>{report.crop}</strong><small>{report.produce} · {report.detail}</small></span><Status tone={report.tone as Tone}>{report.due}</Status><ArrowRight /></button>)}</div></section>
    </div>
  );
}

function AdminOverview({ onAction, onNavigate }: OverviewProps) {
  const data = overviewData.admin;
  return (
    <div className="role-overview admin-overview">
      <section className="admin-health">{data.health.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small><Status tone={item.tone as Tone}>{item.tone === 'warning' ? 'Attention' : 'Live'}</Status></article>)}</section>
      <section className="admin-grid">
        <article className="panel verification-console"><PanelTitle eyebrow="Identity and provider trust" title="Verification queue" action="Open queue" onAction={() => onNavigate('Verification')} /><div className="admin-table"><div className="admin-table-head"><span>Applicant</span><span>Actor</span><span>Age</span><span>Evidence</span><span>Review signal</span></div>{data.verification.map((row) => <button key={row.applicant} onClick={() => onAction(`${row.applicant} verification opened.`)}><strong>{row.applicant}</strong><span>{row.actor}</span><span>{row.age}</span><span>{row.documents}</span><Status tone={row.tone as Tone}>{row.risk}</Status><ChevronRight /></button>)}</div></article>
        <article className="panel risk-console"><PanelTitle eyebrow="Escalation desk" title="Cases requiring review" action="View disputes" onAction={() => onNavigate('Disputes')} /><div>{data.cases.map((item) => <button key={item.id} onClick={() => onAction(`${item.id} case opened.`)}><span className="case-id">{item.id}</span><span><strong>{item.type}</strong><small>{item.parties} · open {item.age}</small></span><Status tone={item.tone as Tone}>{item.state}</Status></button>)}</div></article>
      </section>
      <section className="admin-lower-grid">
        <article className="panel outcomes-panel"><PanelTitle eyebrow="Marketplace outcomes" title="Farmer and trade health" action="Open analytics" onAction={() => onNavigate('Analytics')} /><div className="outcome-cards">{data.outcomes.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span><small>{item.width >= 90 ? 'Healthy' : item.width >= 85 ? 'Monitor' : 'Needs attention'}</small></div>)}</div></article>
        <article className="panel audit-panel"><PanelTitle eyebrow="Accountability" title="Recent audit trail" />{data.audit.map((entry) => <div key={`${entry.time}-${entry.event}`}><time>{entry.time}</time><span><strong>{entry.event}</strong><small>{entry.actor}</small></span></div>)}</article>
      </section>
    </div>
  );
}

type OverviewProps = {
  onAction: (message: string) => void;
  onNavigate: (screen: string) => void;
  onOpenAgreement?: (agreementId: string) => void;
};

export function RoleOverview({ roleId, ...props }: OverviewProps & { roleId: RoleId }) {
  if (roleId === 'farmer') return <FarmerOverview {...props} />;
  if (roleId === 'fpo') return <FpoOverview {...props} />;
  if (roleId === 'buyer') return <BuyerOverview {...props} />;
  if (roleId === 'storage') return <StorageOverview {...props} />;
  if (roleId === 'transport') return <TransportOverview {...props} />;
  if (roleId === 'quality') return <QualityOverview {...props} />;
  return <AdminOverview {...props} />;
}
