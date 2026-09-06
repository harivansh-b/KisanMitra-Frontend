'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight, CheckCircle2, Clock3, FileCheck2, Globe2, Handshake, LockKeyhole,
  RotateCcw, ShieldCheck,
} from 'lucide-react';

import { tradeAgreementsFixture as agreementData, formsFixture as formData, workspacesFixture as workspaceData } from '@/data/fixtures';
import { usePrototypeStore, type CreatedAgreement } from '@/components/prototype-store';
import { VerifiedIdentity } from '@/components/verified-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

type BuilderActor = 'buyer' | 'fpo' | 'farmer';
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
  visibility?: 'public' | 'private';
  sections: AgreementSection[];
  history: string[];
  conditional?: {
    target: string;
    currentlyReserved: string;
    remaining: string;
    conditionDeadline: string;
    confirmationRule: string;
  };
};

const fixtures = agreementData.agreements as Record<string, AgreementView>;
const farmerCropOptions = formData.farmerAddProduce.fields
  .find((field) => field.label === 'Crop type')?.options ?? [];
const farmerOfferRecipients = agreementData.builder.farmerRecipients as Array<{ name: string; type: string; detail: string }>;
type FarmerInventoryProduce = {
  id: string;
  title: string;
  crop: string;
  variety: string;
  availableQuantity: number;
  location: string;
  stage: string;
  qualityGrade: string;
  qualitySpecifications: string;
  qualityLabel: string;
};

const farmerInventoryFixtures = workspaceData.farmer.Produce.records as Array<{
  id: string;
  title: string;
  subtitle: string;
  stage: string;
  crop: string;
  variety: string;
  availableQuantity: number;
  qualityGrade: string;
  qualitySpecifications: string;
  qualityLabel: string;
  qualityVerified: boolean;
}>;

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
  actor, open, onOpenChange, onPublish, onSaveDraft,
}: {
  actor: BuilderActor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (agreement: Omit<CreatedAgreement, 'id'>) => void;
  onSaveDraft: (agreement: Omit<CreatedAgreement, 'id'>) => void;
}) {
  const content = agreementData.builder[actor];
  const { state: prototypeState } = usePrototypeStore();
  const farmerInventory = useMemo<FarmerInventoryProduce[]>(() => [
    ...farmerInventoryFixtures
      .filter((produce) => produce.stage !== 'Pre-harvest' && produce.qualityVerified && produce.availableQuantity > 0)
      .map((produce) => ({
        id: produce.id,
        title: produce.title,
        crop: produce.crop,
        variety: produce.variety,
        availableQuantity: produce.availableQuantity,
        location: produce.subtitle,
        stage: produce.stage,
        qualityGrade: produce.qualityGrade,
        qualitySpecifications: produce.qualitySpecifications,
        qualityLabel: produce.qualityLabel,
      })),
    ...prototypeState.createdProduce
      .filter((produce) => produce.stage !== 'Pre-harvest' && produce.qualityStatus === 'Assessed and valid' && Number(produce.quantity) > 0)
      .map((produce) => ({
        id: produce.id,
        title: produce.variety ? `${produce.crop} · ${produce.variety}` : produce.crop,
        crop: produce.crop,
        variety: produce.variety || 'Recorded on produce',
        availableQuantity: Number(produce.quantity),
        location: produce.location,
        stage: produce.stage,
        qualityGrade: 'Assessed and valid',
        qualitySpecifications: produce.notes || 'Use the assessment attached to this produce.',
        qualityLabel: 'Assessment valid',
      })),
  ], [prototypeState.createdProduce]);
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
    } else if (actor === 'farmer') {
      const produce = farmerInventory[0];
      defaults.agreement_name = produce ? `${produce.crop} offer window` : 'Produce offer window';
      defaults.produce_id = produce?.id ?? '';
      defaults.crop = produce?.crop ?? '';
      defaults.variety = produce?.variety ?? '';
      defaults.quantity_kg = String(produce?.availableQuantity ?? 0);
      defaults.quantity_tolerance = 'Up to available quantity';
      defaults.quality_grade = produce?.qualityGrade ?? '';
      defaults.quality_specifications = produce?.qualitySpecifications ?? '';
      defaults.production_region = produce?.location ?? '';
      defaults.price_per_kg = '29.50';
      defaults.price_basis = 'Minimum price; Buyers and FPOs submit offers';
      defaults.delivery_location = produce?.location ?? '';
      defaults.delivery_date = '2026-09-07';
      defaults.delivery_window = '08:00–12:00';
      defaults.quality_terms = produce?.qualityLabel ?? '';
    }
    return defaults;
  }, [actor, farmerInventory]);
  const [values, setValues] = useState<AgreementValues>(initialValues);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [recipients, setRecipients] = useState<string[]>([]);

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function selectFarmerProduce(produceId: string) {
    const produce = farmerInventory.find((item) => item.id === produceId);
    if (!produce) return;
    setValues((current) => ({
      ...current,
      agreement_name: `${produce.crop} offer window`,
      produce_id: produce.id,
      crop: produce.crop,
      variety: produce.variety,
      quantity_kg: String(produce.availableQuantity),
      quality_grade: produce.qualityGrade,
      quality_specifications: produce.qualitySpecifications,
      production_region: produce.location,
      delivery_location: produce.location,
      quality_terms: produce.qualityLabel,
    }));
  }

  const selectedFarmerProduce = actor === 'farmer'
    ? farmerInventory.find((produce) => produce.id === values.produce_id)
    : undefined;

  function agreementPayload(status: string): Omit<CreatedAgreement, 'id'> {
    return {
      actor,
      title: values.agreement_name || 'Untitled requirement',
      crop: values.crop || 'Produce not selected',
      grade: values.quality_grade || 'Grade not selected',
      quantity: values.quantity_kg || '0',
      price: values.price_per_kg || '0',
      deliveryLocation: values.delivery_location || 'Not set',
      deliveryDate: values.delivery_date || 'Not set',
      expiry: values.proposal_expiry || 'Not set',
      status,
      visibility: actor === 'fpo' ? 'private' : visibility,
      recipients: actor === 'farmer' && visibility === 'private' ? recipients : undefined,
      terms: { ...values, visibility: actor === 'fpo' ? 'private' : visibility, recipients: recipients.join(', ') },
    };
  }

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    onPublish(agreementPayload(actor === 'farmer'
      ? visibility === 'public' ? 'Offer window open' : 'Private invitations sent'
      : visibility === 'public' ? 'Public proposals open' : 'Private direct offers ready'));
    onOpenChange(false);
  }

  function saveDraft() {
    onSaveDraft(agreementPayload('Draft'));
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
            {actor !== 'fpo' && (
              <section className="agreement-form-section requirement-visibility-section">
                <div className="agreement-section-title"><span>1</span><div><h3>Choose who can see this {actor === 'farmer' ? 'offer window' : 'requirement'}</h3><p>Visibility is locked after publishing. Drafts remain visible only to you.</p></div></div>
                <RadioGroup className="visibility-options" value={visibility} onValueChange={(value) => setVisibility(value as 'public' | 'private')}>
                  <label htmlFor={`${actor}-proposal-public`} className={visibility === 'public' ? 'is-selected' : ''}>
                    <RadioGroupItem id={`${actor}-proposal-public`} value="public" />
                    <span className="visibility-icon"><Globe2 /></span>
                    <span><strong>Public {actor === 'farmer' ? 'offer window' : 'requirement'}</strong><small>{actor === 'farmer' ? 'Visible to eligible verified Buyers and FPOs who can submit competing offers.' : 'Eligible sellers submit supply proposals. You compare them and award exact quantities after responses close.'}</small></span>
                  </label>
                  <label htmlFor={`${actor}-proposal-private`} className={visibility === 'private' ? 'is-selected' : ''}>
                    <RadioGroupItem id={`${actor}-proposal-private`} value="private" />
                    <span className="visibility-icon"><LockKeyhole /></span>
                    <span><strong>{actor === 'farmer' ? 'Private offer window' : 'Private direct offer'}</strong><small>{actor === 'farmer' ? 'Invite only selected verified Buyers and FPOs to respond.' : 'Send fixed terms to selected sellers. Accepted quantities reserve immediately and accepted sellers cannot be replaced.'}</small></span>
                  </label>
                </RadioGroup>
                {actor === 'farmer' && visibility === 'private' && (
                  <fieldset className="farmer-offer-recipient-picker">
                    <legend>Select verified recipients</legend>
                    <p>Choose one or more Buyers or FPOs to invite.</p>
                    <div>{farmerOfferRecipients.map((recipient) => {
                      const selected = recipients.includes(recipient.name);
                      return <label className={selected ? 'is-selected' : ''} key={recipient.name}><input type="checkbox" checked={selected} onChange={() => setRecipients((current) => selected ? current.filter((name) => name !== recipient.name) : [...current, recipient.name])} /><span className={selected ? 'selection-box is-selected' : 'selection-box'}>{selected && <CheckCircle2 />}</span><span><strong>{recipient.name}</strong><small>{recipient.type} · {recipient.detail}</small></span></label>;
                    })}</div>
                  </fieldset>
                )}
              </section>
            )}
            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>{actor === 'fpo' ? 1 : 2}</span><div><h3>Parties and purpose</h3><p>{actor === 'farmer' ? 'Choose the produce being offered and who may respond.' : 'Who is proposing the purchase and what produce is required.'}</p></div></div>
              <div className="agreement-fields">
                <Field label="Agreement name" name="agreement_name" values={values} onChange={update} wide />
                <div className="agreement-party"><small>Proposed by</small><VerifiedIdentity name={content.party} as="strong" /></div>
                <div className="agreement-party"><small>{actor !== 'fpo' && visibility === 'private' ? 'Recipients' : 'Open to'}</small><strong>{actor === 'farmer' && visibility === 'private' ? recipients.length ? `${recipients.length} selected` : 'Select recipients above' : actor === 'buyer' && visibility === 'private' ? 'Selected verified Farmers and FPOs' : content.counterparty}</strong></div>
                {actor === 'farmer' ? (
                  <div className="agreement-field is-wide">
                    <label htmlFor="farmer-offer-produce">Produce currently in hand</label>
                    <Select value={values.produce_id || null} onValueChange={(value) => selectFarmerProduce(value ?? '')}>
                      <SelectTrigger id="farmer-offer-produce" className="agreement-select"><SelectValue placeholder="Select eligible produce" /></SelectTrigger>
                      <SelectContent>{farmerInventory.map((produce) => <SelectItem value={produce.id} key={produce.id}>{produce.id} · {produce.title} · {produce.availableQuantity.toLocaleString('en-IN')} kg</SelectItem>)}</SelectContent>
                    </Select>
                    <small>Only harvested, quality-assessed produce with available Farmer-owned quantity can be offered.</small>
                  </div>
                ) : <>
                  <Field label="Crop" name="crop" values={values} onChange={update} type="select" options={farmerCropOptions} />
                  <Field label="Variety" name="variety" values={values} onChange={update} />
                  <Field label="Eligible production region" name="production_region" values={values} onChange={update} wide />
                </>}
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>{actor === 'fpo' ? 2 : 3}</span><div><h3>{actor === 'farmer' ? 'Inventory facts' : 'Quantity and objective quality'}</h3><p>{actor === 'farmer' ? 'These values come from the selected produce and cannot be changed in an offer window.' : 'Use measurable terms so acceptance is not subjective.'}</p></div></div>
              {actor === 'farmer' ? (
                <div className="offer-produce-lock" aria-label="Read-only produce facts">
                  <div><small>Crop and variety</small><strong>{values.crop} · {values.variety}</strong></div>
                  <div><small>Available quantity</small><strong>{Number(values.quantity_kg || 0).toLocaleString('en-IN')} kg</strong></div>
                  <div><small>Lifecycle state</small><strong>{selectedFarmerProduce?.stage ?? 'Not available'}</strong></div>
                  <div><small>Verified quality</small><strong>{values.quality_grade}</strong></div>
                  <div className="is-wide"><small>Assessment specification</small><strong>{values.quality_specifications}</strong></div>
                  <div className="is-wide offer-produce-lock-note"><LockKeyhole /><span>Quantity and quality can only change from the Produce record after measurement or reassessment.</span></div>
                </div>
              ) : (
                <div className="agreement-fields">
                  <Field label="Required quantity (kg)" name="quantity_kg" values={values} onChange={update} type="number" />
                  <Field label="Quantity tolerance" name="quantity_tolerance" values={values} onChange={update} type="select" options={['No tolerance', '± 2%', '± 5%', 'Up to available quantity']} />
                  <Field label="Required grade" name="quality_grade" values={values} onChange={update} type="select" options={['Grade A', 'Grade B', 'FAQ', 'Export grade', 'Buyer specification']} />
                  <Field label="Quality specifications" name="quality_specifications" values={values} onChange={update} type="textarea" wide help="Describe measurable size, moisture, maturity, defects or an assessment standard." />
                </div>
              )}
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>{actor === 'fpo' ? 3 : 4}</span><div><h3>Price, delivery and payment</h3><p>Make the price calculation and fulfilment dates unambiguous.</p></div></div>
              <div className="agreement-fields">
                <Field label={actor === 'farmer' ? 'Minimum acceptable price per kg (₹)' : 'Price per accepted kg (₹)'} name="price_per_kg" values={values} onChange={update} type="number" />
                <Field label="Price basis" name="price_basis" values={values} onChange={update} type="select" options={actor === 'farmer' ? ['Minimum price; Buyers and FPOs submit offers', 'Fixed asking price per accepted kg', 'Fixed base price with grade adjustment'] : ['Fixed price per accepted kg', 'Fixed base price with grade adjustment', 'Price proposed by farmer']} />
                <Field label={actor === 'fpo' ? 'Collection location' : actor === 'farmer' ? 'Pickup location' : 'Delivery location'} name="delivery_location" values={values} onChange={update} wide />
                <Field label={actor === 'fpo' ? 'Collection date' : actor === 'farmer' ? 'Produce available from' : 'Required delivery date'} name="delivery_date" values={values} onChange={update} type="date" />
                <Field label="Delivery / collection window" name="delivery_window" values={values} onChange={update} />
                <Field label="Payment timing" name="payment_terms" values={values} onChange={update} type="select" options={['Same day after accepted delivery', 'Within 2 days of accepted delivery', 'Within 2 days of purchase confirmation', 'Within 7 days of accepted delivery']} />
                <Field label="Payment method" name="payment_method" values={values} onChange={update} type="select" options={['Bank transfer / UPI', 'Bank transfer', 'UPI']} />
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>{actor === 'fpo' ? 4 : 5}</span><div><h3>Responsibilities and safeguards</h3><p>Assign transport, assessment, inspection and rejected-produce handling before acceptance.</p></div></div>
              <div className="agreement-fields">
                <Field label="Transport responsibility" name="transport_terms" values={values} onChange={update} type="select" options={['Buyer arranges and pays', 'Seller arranges; buyer pays', 'Seller arranges and pays', 'FPO arranges and pays inbound transport']} />
                {actor !== 'farmer' && <Field label="Quality assessment" name="quality_terms" values={values} onChange={update} />}
                <Field label="Weighing and inspection" name="weighing_terms" values={values} onChange={update} wide />
                <Field label="Partial acceptance rule" name="partial_acceptance" values={values} onChange={update} type="textarea" wide />
                <Field label="Rejected produce rule" name="rejected_produce" values={values} onChange={update} type="textarea" wide />
                <Field label="Ownership transfer" name="ownership_transfer" values={values} onChange={update} />
                <Field label="Transport risk bearer" name="transport_risk" values={values} onChange={update} />
              </div>
            </section>

            <section className="agreement-form-section">
              <div className="agreement-section-title"><span>{actor === 'fpo' ? 5 : 6}</span><div><h3>Exceptions, disputes and validity</h3><p>State how unexpected events and disagreements will be handled.</p></div></div>
              <div className="agreement-fields">
                <Field label="Events outside either party’s control" name="exceptions" values={values} onChange={update} type="textarea" wide />
                <Field label="Dispute process" name="dispute_process" values={values} onChange={update} type="textarea" wide />
                <Field label="Proposal expires" name="proposal_expiry" values={values} onChange={update} type="datetime-local" />
                <Field label="Additional terms" name="additional_terms" values={values} onChange={update} type="textarea" wide />
              </div>
            </section>
          </div>

          <aside className="agreement-preview" aria-label="Agreement summary">
            <div className="agreement-preview-status"><ShieldCheck /><span><strong>{actor === 'farmer' ? `${visibility === 'public' ? 'Public' : 'Private'} offer window` : actor === 'buyer' ? visibility === 'private' ? 'Private direct offer' : 'Public requirement' : 'Commercial terms proposal'}</strong><small>{actor === 'farmer' ? 'Farmer selects the preferred valid response' : actor === 'buyer' && visibility === 'private' ? 'Seller acceptance immediately reserves an exact quantity' : actor === 'buyer' ? 'Seller proposals require a later Buyer award' : 'Becomes frozen only after acceptance'}</small></span></div>
            <p className="eyebrow">Live summary</p>
            <h3>{values.agreement_name || 'Untitled agreement'}</h3>
            <dl>
              <div><dt>Produce</dt><dd>{values.crop} · {values.quality_grade}</dd></div>
              <div><dt>Quantity</dt><dd>{Number(values.quantity_kg || 0).toLocaleString('en-IN')} kg · {values.quantity_tolerance}</dd></div>
              <div><dt>Price</dt><dd>₹{values.price_per_kg || '—'}/accepted kg</dd></div>
              <div><dt>{actor === 'fpo' ? 'Collection' : actor === 'farmer' ? 'Pickup' : 'Delivery'}</dt><dd>{values.delivery_location}<br />{values.delivery_date}</dd></div>
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
            <Button type="button" variant="outline" onClick={saveDraft}>Save as draft</Button>
            <Button type="submit" disabled={actor === 'farmer' && (!selectedFarmerProduce || (visibility === 'private' && recipients.length === 0))}>{actor === 'farmer' ? visibility === 'private' ? 'Send private invitations' : 'Publish public offer window' : actor === 'buyer' ? visibility === 'private' ? 'Prepare private direct offer' : 'Publish public requirement' : content.submitLabel}<ArrowRight data-icon="inline-end" /></Button>
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
    from: agreement.actor === 'buyer' ? 'MahaFresh Foods' : agreement.actor === 'farmer' ? 'Ramesh Patil' : 'Nashik Farmers Producer Co.',
    to: agreement.actor === 'farmer'
      ? agreement.visibility === 'private' ? agreement.recipients?.join(', ') || 'Selected verified Buyers and FPOs' : 'Eligible verified Buyers and FPOs'
      : agreement.actor === 'buyer'
        ? agreement.visibility === 'private' ? 'Selected verified farmers and FPOs' : 'Eligible verified farmers and FPOs'
        : 'Eligible verified farmers',
    purpose: `${agreement.actor === 'farmer' ? 'Offer' : 'Source'} ${agreement.crop} · ${agreement.grade}`,
    expires: terms.proposal_expiry || agreement.expiry,
    version: 'Version 1 · created this session',
    price: `₹${agreement.price}/kg`,
    quantity: `${Number(agreement.quantity).toLocaleString('en-IN')} kg`,
    sellerNet: 'Final net depends on accepted responsibilities and quantity',
    visibility: agreement.visibility,
    sections: [
      { title: 'Produce and quality', items: [`${agreement.crop} · ${terms.variety || 'Any variety'}`, `${agreement.grade}: ${terms.quality_specifications}`, `Quantity: ${Number(agreement.quantity).toLocaleString('en-IN')} kg · ${terms.quantity_tolerance}`, `Eligible region: ${terms.production_region}`] },
      { title: 'Delivery and inspection', items: [`Location: ${agreement.deliveryLocation}`, `Date / window: ${agreement.deliveryDate} · ${terms.delivery_window}`, `Transport: ${terms.transport_terms}`, `Weighing: ${terms.weighing_terms}`] },
      { title: 'Price and payment', items: [`Price: ₹${agreement.price} per accepted kg`, `Basis: ${terms.price_basis}`, `Payment: ${terms.payment_terms}`, `Method: ${terms.payment_method}`] },
      { title: 'Risk and exceptions', items: [`Ownership: ${terms.ownership_transfer}`, `Transport risk: ${terms.transport_risk}`, `Rejected produce: ${terms.rejected_produce}`, `Disputes: ${terms.dispute_process}`] },
    ],
    history: [agreement.actor === 'farmer' ? 'Offer window published this session' : 'Proposal published this session'],
  };
}

export function getAgreementView(id: string, created?: CreatedAgreement) {
  return created ? createdAgreementView(created) : fixtures[id];
}

export function AgreementReviewSheet({
  agreement, open, onOpenChange, ownerView = false, negotiator = 'farmer', response,
  responseKey, onRespond, onAction,
}: {
  agreement?: AgreementView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerView?: boolean;
  negotiator?: 'farmer' | 'fpo' | 'buyer';
  response?: string;
  responseKey?: string;
  onRespond: (agreementId: string, response: string) => void;
  onAction: (message: string) => void;
}) {
  const [decision, setDecision] = useState('');
  const [counterOpen, setCounterOpen] = useState(false);
  const [partialAcceptance, setPartialAcceptance] = useState(false);
  const [counter, setCounter] = useState({ price: '', quantity: '', payment: '', transport: '', conditionDeadline: '', note: '' });

  if (!agreement) return null;
  const currentAgreement = agreement;
  const acceptingReservation = negotiator === 'farmer' && currentAgreement.id.startsWith('CAM');
  const buyerRequirement = !ownerView && (currentAgreement.id.startsWith('REQ') || currentAgreement.id.startsWith('CC'));
  const privateDirectOffer = buyerRequirement && currentAgreement.visibility === 'private';
  const publicRequirement = buyerRequirement && currentAgreement.visibility !== 'private';
  const conditional = negotiator === 'fpo' && !privateDirectOffer ? currentAgreement.conditional : undefined;

  function makeDecision(next: string, message: string) {
    setDecision(next);
    onRespond(responseKey ?? currentAgreement.id, next);
    onAction(message);
  }

  function startCounter() {
    setPartialAcceptance(false);
    setCounter({
      price: currentAgreement.price.replace(/[^0-9.]/g, ''),
      quantity: currentAgreement.quantity.replace(/[^0-9]/g, ''),
      payment: 'Within 2 days of accepted delivery',
      transport: 'Buyer arranges and pays',
      conditionDeadline: conditional?.conditionDeadline ?? '',
      note: '',
    });
    setCounterOpen(true);
  }

  function startPartialAcceptance() {
    startCounter();
    setPartialAcceptance(true);
  }

  function closeSheet(nextOpen: boolean) {
    if (!nextOpen) {
      setDecision('');
      setCounterOpen(false);
      setPartialAcceptance(false);
    }
    onOpenChange(nextOpen);
  }

  function sendCounter(event: { preventDefault: () => void }) {
    event.preventDefault();
    setCounterOpen(false);
    if (partialAcceptance) {
      makeDecision(privateDirectOffer ? `Partially committed · ${counter.quantity} kg` : `Partial supply proposal · ${counter.quantity} kg`, privateDirectOffer ? `${counter.quantity} kg committed immediately to ${currentAgreement.id}.` : `Partial supply proposal sent for ${currentAgreement.id}; Buyer award pending.`);
      return;
    }
    makeDecision('Counterproposal sent', `Counterproposal sent for ${currentAgreement.id}; no quantity reserved.`);
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

          {conditional && !counterOpen && (
            <section className="conditional-commitment">
              <div className="conditional-heading"><Handshake /><span><strong>Conditional supply proposal</strong><small>The FPO must secure verified supply before this proposal can become a committed trade.</small></span></div>
              <div className="conditional-facts">
                <span><small>Buyer requires</small><strong>{conditional.target}</strong></span>
                <span><small>Currently reserved</small><strong>{conditional.currentlyReserved}</strong></span>
                <span><small>Still required</small><strong>{conditional.remaining}</strong></span>
                <span><small>Condition deadline</small><strong>{conditional.conditionDeadline}</strong></span>
              </div>
              <p>{conditional.confirmationRule}. A public proposal remains subject to an explicit Buyer award.</p>
            </section>
          )}

          {counterOpen ? (
            <form className="counter-form" onSubmit={sendCounter}>
              <div className="agreement-section-title"><span><RotateCcw /></span><div><h3>{partialAcceptance ? 'Accept a partial quantity' : 'Send a counterproposal'}</h3><p>{partialAcceptance ? privateDirectOffer ? 'The entered quantity will be reserved immediately at the Buyer’s stated terms.' : 'The entered quantity remains unreserved until the Buyer awards it.' : 'Only changed terms will be highlighted for the buyer or FPO.'}</p></div></div>
              <div className="agreement-fields">
                {!partialAcceptance && <div className="agreement-field"><label htmlFor="counter-price">Price per kg (₹)</label><Input id="counter-price" value={counter.price} onChange={(event) => setCounter({ ...counter, price: event.target.value })} required /></div>}
                <div className="agreement-field"><label htmlFor="counter-quantity">Quantity (kg)</label><Input id="counter-quantity" type="number" value={counter.quantity} onChange={(event) => setCounter({ ...counter, quantity: event.target.value })} required /></div>
                {!partialAcceptance && <><div className="agreement-field is-wide"><label htmlFor="counter-payment">Payment timing</label><Input id="counter-payment" value={counter.payment} onChange={(event) => setCounter({ ...counter, payment: event.target.value })} required /></div><div className="agreement-field is-wide"><label htmlFor="counter-transport">Transport responsibility</label><Input id="counter-transport" value={counter.transport} onChange={(event) => setCounter({ ...counter, transport: event.target.value })} required /></div>{negotiator === 'fpo' && <div className="agreement-field is-wide"><label htmlFor="counter-condition-deadline">Supply confirmation deadline</label><Input id="counter-condition-deadline" value={counter.conditionDeadline} onChange={(event) => setCounter({ ...counter, conditionDeadline: event.target.value })} required /></div>}<div className="agreement-field is-wide"><label htmlFor="counter-note">Reason or note</label><Textarea id="counter-note" value={counter.note} onChange={(event) => setCounter({ ...counter, note: event.target.value })} placeholder="Explain what you changed and why" /></div></>}
              </div>
              <div className="counter-actions"><Button type="button" variant="outline" onClick={() => setCounterOpen(false)}>Back to terms</Button><Button type="submit">{partialAcceptance ? privateDirectOffer ? 'Accept and reserve quantity' : 'Submit partial proposal' : 'Send counterproposal'}<ArrowRight data-icon="inline-end" /></Button></div>
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
              <aside className="agreement-advisory"><ShieldCheck />{privateDirectOffer ? 'Acceptance immediately reserves the exact quantity and fixes you as a contributing seller. The Buyer cannot replace you unless the trade is cancelled under its stated rules.' : publicRequirement ? 'Your supply proposal does not reserve produce. The Buyer must award an exact quantity before a trade exists.' : 'Accepted terms become a read-only trade snapshot. Any later change requires a new proposal accepted by both parties.'}</aside>
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
                {buyerRequirement && <Button variant="outline" onClick={startPartialAcceptance}>Partial quantity</Button>}
                <Button onClick={() => makeDecision(acceptingReservation ? 'Quantity reserved' : privateDirectOffer ? 'Committed · seller locked' : publicRequirement ? 'Supply proposal submitted' : negotiator === 'fpo' ? 'Conditional proposal submitted' : 'Accepted · terms frozen', acceptingReservation ? `${agreement.id} accepted; quantity reserved.` : privateDirectOffer ? `${agreement.id} accepted; quantity reserved and seller locked.` : publicRequirement ? `Supply proposal submitted for ${agreement.id}; Buyer award pending.` : negotiator === 'fpo' ? `Conditional proposal submitted for ${agreement.id}.` : `${agreement.id} accepted; terms frozen.`)}>
                  {acceptingReservation ? 'Accept and reserve' : privateDirectOffer ? 'Accept and reserve' : publicRequirement ? 'Submit supply proposal' : negotiator === 'fpo' ? 'Submit conditional proposal' : 'Accept agreement'}<ArrowRight data-icon="inline-end" />
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
