'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, FlaskConical, Handshake,
  Leaf, Scale, Send, Tractor, Truck, Warehouse,
} from 'lucide-react';

import { serviceRequestsFixture as serviceData } from '@/data/fixtures';
import type { CreatedServiceRequest } from '@/components/prototype-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ProduceSummary = {
  id: string;
  title: string;
  subtitle: string;
  quantity: string;
  stage: string;
  details: string[];
};

type ServiceField = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
  required?: boolean;
};

type ServiceDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  providerRole: CreatedServiceRequest['providerRole'];
  providerLabel: string;
  destinationScreen: string;
  lastEligibleStage: number;
  providers: string[];
  fields: ServiceField[];
};

const definitions = serviceData.services as ServiceDefinition[];
const commonFields = serviceData.commonFields as ServiceField[];
const serviceIcons = {
  harvesting: Tractor,
  measurement: Scale,
  quality: FlaskConical,
  storage: Warehouse,
  transport: Truck,
  market_linkage: Handshake,
} as const;

function stageIndex(stage: string) {
  if (stage === 'Quality assessment pending') return 2;
  if (stage === 'In storage') return 4;
  const index = serviceData.stages.findIndex((item) => item.toLowerCase() === stage.toLowerCase());
  return index < 0 ? 0 : index;
}

export function ProduceServicesSheet({
  produce, open, onOpenChange, onCreateRequest,
}: {
  produce?: ProduceSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRequest: (request: Omit<CreatedServiceRequest, 'id'>) => void;
}) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const currentStageIndex = stageIndex(produce?.stage ?? 'Pre-harvest');
  const eligibleServices = useMemo(
    () => definitions.filter((service) => currentStageIndex <= service.lastEligibleStage),
    [currentStageIndex],
  );
  const selectedService = definitions.find((service) => service.id === selectedServiceId);

  if (!produce) return null;

  function close(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedServiceId(null);
      setVisibility('public');
      setRecipients([]);
      setValues({});
    }
    onOpenChange(nextOpen);
  }

  function chooseService(service: ServiceDefinition) {
    setSelectedServiceId(service.id);
    setVisibility('public');
    setRecipients([]);
    setValues({
      quantity: produce?.quantity ?? '',
      estimated_quantity: produce?.quantity ?? '',
      pickup: produce?.subtitle.split('·').at(-1)?.trim() ?? '',
      sampling_location: produce?.subtitle.split('·').at(-1)?.trim() ?? '',
    });
  }

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function toggleRecipient(provider: string) {
    setRecipients((current) => current.includes(provider)
      ? current.filter((item) => item !== provider)
      : [...current, provider]);
  }

  function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedService) return;
    onCreateRequest({
      produceId: produce!.id,
      produceName: produce!.title,
      produceStage: produce!.stage,
      serviceId: selectedService.id,
      serviceLabel: selectedService.label,
      providerRole: selectedService.providerRole,
      destinationScreen: selectedService.destinationScreen,
      visibility,
      recipient: visibility === 'private' ? recipients.join(', ') : 'All matching verified providers',
      location: values.pickup || values.sampling_location || produce!.subtitle.split('·').at(-1)?.trim() || 'Produce location',
      requiredDate: values.service_date,
      quoteDeadline: values.quote_deadline,
      requirements: Object.fromEntries(
        [...selectedService.fields, ...commonFields]
          .filter((field) => values[field.name])
          .map((field) => [field.label, values[field.name]]),
      ),
    });
    close(false);
  }

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent className="produce-services-sheet">
        <SheetHeader className="produce-services-header">
          <div className="service-produce-id"><Leaf aria-hidden="true" /><span>{produce.id}</span></div>
          <SheetTitle>{selectedService ? selectedService.label : produce.title}</SheetTitle>
          <SheetDescription>{selectedService ? selectedService.description : `${produce.quantity} · ${produce.subtitle}`}</SheetDescription>
        </SheetHeader>

        {!selectedService ? (
          <div className="produce-services-body">
            <section className="produce-stage-summary">
              <span><small>Current stage</small><strong>{produce.stage}</strong></span>
              <span><small>Available next</small><strong>{eligibleServices.length} services</strong></span>
            </section>
            <section className="service-guidance">
              <h3>Services available from this stage</h3>
              <p>You can request work needed now or plan later steps in advance. Completed stages are intentionally hidden.</p>
            </section>
            {eligibleServices.length > 0 ? (
              <div className="service-option-list">
                {eligibleServices.map((service, index) => {
                  const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? Handshake;
                  return (
                    <button key={service.id} onClick={() => chooseService(service)}>
                      <span className="service-option-icon"><Icon aria-hidden="true" /></span>
                      <span><strong>{service.label}</strong><small>{service.description}</small><em>{service.providerLabel}</em></span>
                      <span className={cn('service-timing', index === 0 && 'is-next')}>{index === 0 ? 'Recommended next' : 'Plan ahead'}</span>
                      <ArrowRight aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="service-empty"><CheckCircle2 /><h3>No new service needed</h3><p>This produce has reached {produce.stage.toLowerCase()}. Open its trade to manage the remaining transaction.</p></div>
            )}
          </div>
        ) : (
          <form className="service-request-form" onSubmit={submit}>
            <button type="button" className="service-back" onClick={() => setSelectedServiceId(null)}><ArrowLeft />Back to services</button>
            <section className="service-request-context">
              <span><small>Produce</small><strong>{produce.title}</strong></span>
              <span><small>Current stage</small><strong>{produce.stage}</strong></span>
              <span><small>Quantity</small><strong>{produce.quantity}</strong></span>
            </section>
            <fieldset className="service-visibility">
              <legend>Who should receive this request?</legend>
              <label htmlFor="service-visibility-public" className={cn(visibility === 'public' && 'is-selected')}>
                <input id="service-visibility-public" type="radio" name="service-visibility" value="public" checked={visibility === 'public'} onChange={() => { setVisibility('public'); setRecipients([]); }} />
                <strong>Public request</strong><small>Visible to matching verified {selectedService.providerLabel.toLowerCase()}s.</small>
              </label>
              <label htmlFor="service-visibility-private" className={cn(visibility === 'private' && 'is-selected')}>
                <input id="service-visibility-private" type="radio" name="service-visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} />
                <strong>Private request</strong><small>Only the verified providers you select can review and respond.</small>
              </label>
            </fieldset>
            {visibility === 'private' && (
              <fieldset className="service-provider-picker" aria-required="true">
                <legend>Select verified providers</legend>
                <p>Choose one or more providers who should receive this private request.</p>
                <div className="service-provider-options">
                  {selectedService.providers.map((provider) => {
                    const selected = recipients.includes(provider);
                    return (
                      <label className={cn(selected && 'is-selected')} key={provider}>
                        <input type="checkbox" checked={selected} onChange={() => toggleRecipient(provider)} />
                        <span className={cn('selection-box', selected && 'is-selected')} aria-hidden="true">{selected && <Check />}</span>
                        <span><strong>{provider}</strong><small>Verified {selectedService.providerLabel.toLowerCase()}</small></span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <div className="service-fields">
              {[...selectedService.fields, ...commonFields].map((field) => (
                <div className={cn('service-field', field.type === 'textarea' && 'is-wide')} key={field.name}>
                  <label htmlFor={`service-${field.name}`}>{field.label}</label>
                  {field.type === 'select' ? (
                    <select id={`service-${field.name}`} value={values[field.name] ?? ''} onChange={(event) => updateValue(field.name, event.target.value)} required={field.required !== false}>
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => <option value={option} key={option}>{option}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <Textarea id={`service-${field.name}`} value={values[field.name] ?? ''} onChange={(event) => updateValue(field.name, event.target.value)} placeholder={field.placeholder} required={field.required !== false} />
                  ) : (
                    <Input id={`service-${field.name}`} type={field.type} value={values[field.name] ?? ''} onChange={(event) => updateValue(field.name, event.target.value)} placeholder={field.placeholder} required={field.required !== false} />
                  )}
                </div>
              ))}
            </div>
            <aside className="service-request-note"><Clock3 /><span><strong>A response is not a booking</strong><small>The service is confirmed only after you review and award a provider response.</small></span></aside>
            <SheetFooter className="service-request-footer">
              <Button type="button" variant="outline" onClick={() => setSelectedServiceId(null)}>Cancel</Button>
              <Button type="submit" disabled={visibility === 'private' && recipients.length === 0}><Send />Publish request</Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function ServiceRequestReviewSheet({
  request, open, onOpenChange, ownerView, response, onRespond, onAction,
}: {
  request?: CreatedServiceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerView: boolean;
  response?: string;
  onRespond: (requestId: string, response: string) => void;
  onAction: (message: string) => void;
}) {
  if (!request) return null;

  function respond(next: string) {
    onRespond(request!.id, next);
    onAction(`${request!.id}: ${next}.`);
  }

  const canAward = ownerView && response?.startsWith('Accepted');
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="service-review-sheet">
        <SheetHeader className="service-review-header">
          <div className="service-review-meta"><span>{request.id}</span><span>{response ?? 'Awaiting response'}</span></div>
          <SheetTitle>{request.serviceLabel}</SheetTitle>
          <SheetDescription>{request.produceName} · {request.produceId}</SheetDescription>
        </SheetHeader>
        <div className="service-review-body">
          <section className="service-request-context">
            <span><small>Required date</small><strong>{request.requiredDate}</strong></span>
            <span><small>Visibility</small><strong>{request.visibility === 'private' ? 'Private' : 'Public'}</strong></span>
            <span><small>Recipient</small><strong>{request.recipient}</strong></span>
          </section>
          <section className="service-review-terms">
            <h3>Service requirements</h3>
            <dl>{Object.entries(request.requirements).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </section>
          <aside className="service-request-note"><Clock3 /><span><strong>Responses close {request.quoteDeadline}</strong><small>Produce ownership is unaffected by this service request.</small></span></aside>
        </div>
        <SheetFooter className="service-review-footer">
          {ownerView ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              {canAward && <Button onClick={() => respond('Awarded · booking confirmed')}>Award provider<ArrowRight data-icon="inline-end" /></Button>}
            </>
          ) : response ? (
            <><span className="agreement-decision"><CheckCircle2 />{response}</span><Button variant="outline" onClick={() => onOpenChange(false)}>Done</Button></>
          ) : (
            <>
              <Button variant="destructive" onClick={() => respond('Declined by provider')}>Decline</Button>
              <Button onClick={() => respond('Accepted · quote submitted')}>Accept and send quote<ArrowRight data-icon="inline-end" /></Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
