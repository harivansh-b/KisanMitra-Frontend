'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight, CheckCircle2, Clock3, FileCheck2, Handshake, RotateCcw,
  ShieldCheck,
} from 'lucide-react';

import agreementData from '@/mockdata/trade-agreements.json';
import formData from '@/mockdata/forms.json';
import type { CreatedAgreement } from '@/components/prototype-store';
import { VerifiedIdentity } from '@/components/verified-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

type BuilderActor = 'buyer' | 'fpo';
type AgreementValues = Record<string, string>;

type AgreementSection = { title: string; items: string[] };
export type AgreementView = {
  id: string;
  title: string;
  status: string;
  from: string;
  to: string;
  purpose: string;
  expires: string;
  version: string;
  price: string;
  quantity: string;
  sellerNet: string;
  sections: AgreementSection[];
  history: string[];
};

const fixtures = agreementData.agreements as Record<string, AgreementView>;
const farmerCropOptions = formData.farmerAddProduce.fields
  .find((field) => field.label === 'Crop type')?.options ?? [];

function Field({
  label, name, values, onChange, type = 'text', options, help, wide = false,
}: {
  label: string;
  name: string;
  values: AgreementValues;
  onChange: (name: string, value: string) => void;
  type?: string;
  options?: string[];
  help?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'agreement-field is-wide' : 'agreement-field'}>
      <label htmlFor={`agreement-${name}`}>{label}</label>
      {type === 'select' ? (
        <Select value={values[name] || null} onValueChange={(value) => onChange(name, value ?? '')}>
          <SelectTrigger id={`agreement-${name}`} className="agreement-select"><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger>
          <SelectContent>{options?.map((option) => <SelectItem value={option} key={option}>{option}</SelectItem>)}</SelectContent>
        </Select>
      ) : type === 'textarea' ? (
        <Textarea id={`agreement-${name}`} value={values[name] ?? ''} onChange={(event) => onChange(name, event.target.value)} required />
      ) : (
        <Input id={`agreement-${name}`} type={type} value={values[name] ?? ''} onChange={(event) => onChange(name, event.target.value)} required />
      )}
      {help && <small>{help}</small>}
    </div>
  );
}

export function AgreementBuilderDialog({
  actor, open, onOpenChange, onPublish,
}: {
  actor: BuilderActor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (agreement: Omit<CreatedAgreement, 'id'>) => void;
}) {
  const content = agreementData.builder[actor];
  const initialValues = useMemo(() => {
    const defaults = { ...agreementData.builder.defaults } as AgreementValues;
    if (actor === 'fpo') {
      defaults.agreement_name = 'Red onion farmer procurement';
      defaults.price_per_kg = '27.60';
      defaults.delivery_location = 'Pimpalgaon collection centre';
      defaults.delivery_window = '07:00–15:00';
      defaults.transport_terms = 'FPO arranges and pays inbound transport';
      defaults.payment_terms = 'Within 2 days of purchase confirmation';
      defaults.ownership_transfer = 'Only accepted quantity transfers when FPO confirms purchase';
      defaults.transport_risk = 'FPO after documented pickup';
    }
    return defaults;
  }, [actor]);
  const [values, setValues] = useState<AgreementValues>(initialValues);

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    onPublish({
      actor,
      title: values.agreement_name,
      crop: values.crop,
      grade: values.quality_grade,
      quantity: values.quantity_kg,
      price: values.price_per_kg,
      deliveryLocation: values.delivery_location,
      deliveryDate: values.delivery_date,
      expiry: values.proposal_expiry,
      status: 'Published proposal',
      terms: values,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agreement-builder" showCloseButton>
        <DialogHeader className="agreement-builder-head">
          <span className="dialog-icon"><FileCheck2 /></span>
          <div><p className="eyebrow">{content.eyebrow}</p><DialogTitle>{content.title}</DialogTitle></div>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        <form className="agreement-builder-layout" onSubmit={submit}>
          <div className="agreement-form-scroll">
            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>1</span><div><h3>Parties and purpose</h3><p>Who is proposing the purchase and what produce is required.</p></div></div>
              <div className="agreement-fields">
                <Field label="Agreement name" name="agreement_name" values={values} onChange={update} wide />
                <div className="agreement-party"><small>Proposed by</small><VerifiedIdentity name={content.party} as="strong" /></div>
                <div className="agreement-party"><small>Open to</small><strong>{content.counterparty}</strong></div>
                <Field label="Crop" name="crop" values={values} onChange={update} type="select" options={farmerCropOptions} />
                <Field label="Variety" name="variety" values={values} onChange={update} />
                <Field label="Eligible production region" name="production_region" values={values} onChange={update} wide />
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>2</span><div><h3>Quantity and objective quality</h3><p>Use measurable terms so acceptance is not subjective.</p></div></div>
              <div className="agreement-fields">
                <Field label="Required quantity (kg)" name="quantity_kg" values={values} onChange={update} type="number" />
                <Field label="Quantity tolerance" name="quantity_tolerance" values={values} onChange={update} type="select" options={['No tolerance', '± 2%', '± 5%', 'Up to available quantity']} />
                <Field label="Required grade" name="quality_grade" values={values} onChange={update} type="select" options={['Grade A', 'Grade B', 'FAQ', 'Export grade', 'Buyer specification']} />
                <Field label="Quality specifications" name="quality_specifications" values={values} onChange={update} type="textarea" wide help="Describe measurable size, moisture, maturity, defects or an assessment standard." />
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>3</span><div><h3>Price, delivery and payment</h3><p>Make the price calculation and fulfilment dates unambiguous.</p></div></div>
              <div className="agreement-fields">
                <Field label="Price per accepted kg (₹)" name="price_per_kg" values={values} onChange={update} type="number" />
                <Field label="Price basis" name="price_basis" values={values} onChange={update} type="select" options={['Fixed price per accepted kg', 'Fixed base price with grade adjustment', 'Price proposed by farmer']} />
                <Field label={actor === 'fpo' ? 'Collection location' : 'Delivery location'} name="delivery_location" values={values} onChange={update} wide />
                <Field label={actor === 'fpo' ? 'Collection date' : 'Required delivery date'} name="delivery_date" values={values} onChange={update} type="date" />
                <Field label="Delivery / collection window" name="delivery_window" values={values} onChange={update} />
                <Field label="Payment timing" name="payment_terms" values={values} onChange={update} type="select" options={['Same day after accepted delivery', 'Within 2 days of accepted delivery', 'Within 2 days of purchase confirmation', 'Within 7 days of accepted delivery']} />
                <Field label="Payment method" name="payment_method" values={values} onChange={update} type="select" options={['Bank transfer / UPI', 'Bank transfer', 'UPI']} />
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>4</span><div><h3>Responsibilities and safeguards</h3><p>Assign transport, assessment, inspection and rejected-produce handling before acceptance.</p></div></div>
              <div className="agreement-fields">
                <Field label="Transport responsibility" name="transport_terms" values={values} onChange={update} type="select" options={['Buyer arranges and pays', 'Seller arranges; buyer pays', 'Seller arranges and pays', 'FPO arranges and pays inbound transport']} />
                <Field label="Quality assessment" name="quality_terms" values={values} onChange={update} />
                <Field label="Weighing and inspection" name="weighing_terms" values={values} onChange={update} wide />
                <Field label="Partial acceptance rule" name="partial_acceptance" values={values} onChange={update} type="textarea" wide />
                <Field label="Rejected produce rule" name="rejected_produce" values={values} onChange={update} type="textarea" wide />
                <Field label="Ownership transfer" name="ownership_transfer" values={values} onChange={update} />
                <Field label="Transport risk bearer" name="transport_risk" values={values} onChange={update} />
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>5</span><div><h3>Exceptions, disputes and validity</h3><p>State how unexpected events and disagreements will be handled.</p></div></div>
              <div className="agreement-fields">
                <Field label="Events outside either party’s control" name="exceptions" values={values} onChange={update} type="textarea" wide />
                <Field label="Dispute process" name="dispute_process" values={values} onChange={update} type="textarea" wide />
                <Field label="Proposal expires" name="proposal_expiry" values={values} onChange={update} type="datetime-local" />
                <Field label="Additional terms" name="additional_terms" values={values} onChange={update} type="textarea" wide />
              </div>
            </section>
          </div>

          <aside className="agreement-preview" aria-label="Agreement summary">
            <div className="agreement-preview-status"><ShieldCheck /><span><strong>Commercial terms proposal</strong><small>Becomes frozen only after a seller accepts</small></span></div>
            <p className="eyebrow">Live summary</p>
            <h3>{values.agreement_name || 'Untitled agreement'}</h3>
            <dl>
              <div><dt>Produce</dt><dd>{values.crop} · {values.quality_grade}</dd></div>
              <div><dt>Quantity</dt><dd>{Number(values.quantity_kg || 0).toLocaleString('en-IN')} kg · {values.quantity_tolerance}</dd></div>
              <div><dt>Price</dt><dd>₹{values.price_per_kg || '—'}/accepted kg</dd></div>
              <div><dt>{actor === 'fpo' ? 'Collection' : 'Delivery'}</dt><dd>{values.delivery_location}<br />{values.delivery_date}</dd></div>
              <div><dt>Payment</dt><dd>{values.payment_terms}</dd></div>
            </dl>
            <div className="agreement-checklist">
              <strong>Before publishing</strong>
              <span><CheckCircle2 />Objective quality stated</span>
              <span><CheckCircle2 />Responsibilities assigned</span>
              <span><CheckCircle2 />Rejection fallback stated</span>
              <span><CheckCircle2 />Dispute path included</span>
            </div>
            <p className="agreement-advisory">Use simple language and have final terms reviewed for the applicable transaction and jurisdiction.</p>
          </aside>

          <DialogFooter className="agreement-builder-footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Save draft</Button>
            <Button type="submit">{content.submitLabel}<ArrowRight data-icon="inline-end" /></Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function createdAgreementView(agreement: CreatedAgreement): AgreementView {
  const terms = agreement.terms;
  return {
    id: agreement.id,
    title: agreement.title,
    status: agreement.status,
    from: agreement.actor === 'buyer' ? 'MahaFresh Foods' : 'Nashik Farmers Producer Co.',
    to: agreement.actor === 'buyer' ? 'Eligible verified farmers and FPOs' : 'Eligible verified farmers',
    purpose: `Source ${agreement.crop} · ${agreement.grade}`,
    expires: terms.proposal_expiry || agreement.expiry,
    version: 'Version 1 · created this session',
    price: `₹${agreement.price}/kg`,
    quantity: `${Number(agreement.quantity).toLocaleString('en-IN')} kg`,
    sellerNet: 'Final net depends on accepted responsibilities and quantity',
    sections: [
      { title: 'Produce and quality', items: [`${agreement.crop} · ${terms.variety || 'Any variety'}`, `${agreement.grade}: ${terms.quality_specifications}`, `Quantity: ${Number(agreement.quantity).toLocaleString('en-IN')} kg · ${terms.quantity_tolerance}`, `Eligible region: ${terms.production_region}`] },
      { title: 'Delivery and inspection', items: [`Location: ${agreement.deliveryLocation}`, `Date / window: ${agreement.deliveryDate} · ${terms.delivery_window}`, `Transport: ${terms.transport_terms}`, `Weighing: ${terms.weighing_terms}`] },
      { title: 'Price and payment', items: [`Price: ₹${agreement.price} per accepted kg`, `Basis: ${terms.price_basis}`, `Payment: ${terms.payment_terms}`, `Method: ${terms.payment_method}`] },
      { title: 'Risk and exceptions', items: [`Ownership: ${terms.ownership_transfer}`, `Transport risk: ${terms.transport_risk}`, `Rejected produce: ${terms.rejected_produce}`, `Disputes: ${terms.dispute_process}`] },
    ],
    history: ['Proposal published this session'],
  };
}

export function getAgreementView(id: string, created?: CreatedAgreement) {
  return created ? createdAgreementView(created) : fixtures[id];
}

export function AgreementReviewSheet({
  agreement, open, onOpenChange, ownerView = false, response, onRespond, onAction,
}: {
  agreement?: AgreementView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerView?: boolean;
  response?: string;
  onRespond: (agreementId: string, response: string) => void;
  onAction: (message: string) => void;
}) {
  const [decision, setDecision] = useState('');
  const [counterOpen, setCounterOpen] = useState(false);
  const [counter, setCounter] = useState({ price: '', quantity: '', payment: '', transport: '', note: '' });

  if (!agreement) return null;
  const currentAgreement = agreement;
  const acceptingReservation = currentAgreement.id.startsWith('CAM');

  function makeDecision(next: string, message: string) {
    setDecision(next);
    onRespond(currentAgreement.id, next);
    onAction(message);
  }

  function startCounter() {
    setCounter({
      price: currentAgreement.price.replace(/[^0-9.]/g, ''),
      quantity: currentAgreement.quantity.replace(/[^0-9]/g, ''),
      payment: 'Within 2 days of accepted delivery',
      transport: 'Buyer arranges and pays',
      note: '',
    });
    setCounterOpen(true);
  }

  function closeSheet(nextOpen: boolean) {
    if (!nextOpen) {
      setDecision('');
      setCounterOpen(false);
    }
    onOpenChange(nextOpen);
  }

  function sendCounter(event: { preventDefault: () => void }) {
    event.preventDefault();
    setCounterOpen(false);
    makeDecision('Counterproposal sent', `Counterproposal sent for ${currentAgreement.id}.`);
  }

  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent className="agreement-review-sheet">
        <SheetHeader className="agreement-review-header">
          <div className="agreement-review-meta"><span>{agreement.id}</span><span>{decision || response || agreement.status}</span></div>
          <SheetTitle>{agreement.title}</SheetTitle>
          <SheetDescription>{agreement.purpose}</SheetDescription>
          <div className="agreement-parties"><span><small>Proposed by</small><VerifiedIdentity name={agreement.from} as="strong" /></span><ArrowRight /><span><small>For</small><strong>{agreement.to}</strong></span></div>
        </SheetHeader>

        <div className="agreement-review-body">
          <section className="agreement-key-terms">
            <div><small>Price</small><strong>{agreement.price}</strong></div>
            <div><small>Quantity</small><strong>{agreement.quantity}</strong></div>
            <div><small>Estimated seller net</small><strong>{agreement.sellerNet}</strong></div>
          </section>
          <div className="agreement-validity"><Clock3 /><span><strong>{agreement.version}</strong><small>Respond before {agreement.expires}</small></span></div>

          {counterOpen ? (
            <form className="counter-form" onSubmit={sendCounter}>
              <div className="agreement-section-title"><span><RotateCcw /></span><div><h3>Send a counterproposal</h3><p>Only changed terms will be highlighted for the buyer or FPO.</p></div></div>
              <div className="agreement-fields">
                <div className="agreement-field"><label htmlFor="counter-price">Price per kg (₹)</label><Input id="counter-price" value={counter.price} onChange={(event) => setCounter({ ...counter, price: event.target.value })} required /></div>
                <div className="agreement-field"><label htmlFor="counter-quantity">Quantity (kg)</label><Input id="counter-quantity" type="number" value={counter.quantity} onChange={(event) => setCounter({ ...counter, quantity: event.target.value })} required /></div>
                <div className="agreement-field is-wide"><label htmlFor="counter-payment">Payment timing</label><Input id="counter-payment" value={counter.payment} onChange={(event) => setCounter({ ...counter, payment: event.target.value })} required /></div>
                <div className="agreement-field is-wide"><label htmlFor="counter-transport">Transport responsibility</label><Input id="counter-transport" value={counter.transport} onChange={(event) => setCounter({ ...counter, transport: event.target.value })} required /></div>
                <div className="agreement-field is-wide"><label htmlFor="counter-note">Reason or note</label><Textarea id="counter-note" value={counter.note} onChange={(event) => setCounter({ ...counter, note: event.target.value })} placeholder="Explain what you changed and why" /></div>
              </div>
              <div className="counter-actions"><Button type="button" variant="outline" onClick={() => setCounterOpen(false)}>Back to terms</Button><Button type="submit">Send counterproposal<ArrowRight data-icon="inline-end" /></Button></div>
            </form>
          ) : (
            <>
              <section className="agreement-terms-list">
                {agreement.sections.map((section) => (
                  <article key={section.title}>
                    <h3>{section.title}</h3>
                    <ul>{section.items.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul>
                  </article>
                ))}
              </section>
              <section className="agreement-history"><h3>Proposal history</h3>{agreement.history.map((item) => <div key={item}><Handshake /><span>{item}</span></div>)}</section>
              <aside className="agreement-advisory"><ShieldCheck />Accepted terms become a read-only trade snapshot. Any later change requires a new proposal accepted by both parties.</aside>
            </>
          )}
        </div>

        {!counterOpen && (
          <SheetFooter className="agreement-review-footer">
            {ownerView ? (
              <><Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button><Button onClick={() => onAction(`Editing ${agreement.id} started.`)}>Edit proposal</Button></>
            ) : (decision || response) ? (
              <><span className="agreement-decision"><CheckCircle2 />{decision || response}</span><Button variant="outline" onClick={() => closeSheet(false)}>Done</Button></>
            ) : (
              <>
                <Button variant="destructive" onClick={() => makeDecision('Declined', `${agreement.id} declined.`)}>Decline</Button>
                <Button variant="outline" onClick={startCounter}>Send counterproposal</Button>
                <Button onClick={() => makeDecision(acceptingReservation ? 'Quantity reserved' : 'Accepted · terms frozen', acceptingReservation ? `${agreement.id} accepted; quantity reserved.` : `${agreement.id} accepted; terms frozen.`)}>
                  {acceptingReservation ? 'Accept and reserve' : 'Accept agreement'}<ArrowRight data-icon="inline-end" />
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
