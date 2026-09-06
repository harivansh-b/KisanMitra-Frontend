'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { WorkspaceField } from '@/components/workspace-view';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type FormValues = Record<string, string>;

function fieldKey(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  fields,
  description,
  submitLabel = 'Continue',
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: WorkspaceField[];
  description?: string;
  submitLabel?: string;
  onComplete: (values: FormValues) => void;
}) {
  const shape = Object.fromEntries(
    fields.map((field) => [
      fieldKey(field.label),
      field.required === false
        ? z.string()
        : z.string().min(1, `${field.label} is required`),
    ]),
  );
  const schema = z.object(shape);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function submit(values: FormValues) {
    onComplete(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={fields.length > 6 ? 'action-dialog action-dialog-wide' : 'action-dialog'}>
        <DialogHeader>
          <span className="dialog-icon"><CheckCircle2 /></span>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? (fields.length > 0
              ? 'Complete the required details. This prototype saves the result only for the current session.'
              : 'Review this action before continuing in the local prototype.')}
          </DialogDescription>
        </DialogHeader>
        <form className="action-form" noValidate onSubmit={handleSubmit(submit, () => {
          window.requestAnimationFrame(() => document.querySelector<HTMLElement>('.action-form [aria-invalid="true"]')?.focus());
        })}>
          {Object.keys(errors).length > 0 && <div className="form-error-summary" role="alert"><strong>Check the highlighted fields</strong><span>Complete the required information before continuing.</span></div>}
          {fields.map((field) => {
            const key = fieldKey(field.label);
            const shared = {
              id: `field-${key}`,
              placeholder: field.placeholder,
              'aria-invalid': Boolean(errors[key]),
              'aria-describedby': errors[key] ? `field-${key}-error` : undefined,
              ...register(key),
            };
            return (
              <div className={`form-field form-field-${key}`} key={field.label}>
                <label htmlFor={`field-${key}`}>{field.label}</label>
                {field.type === 'select' ? (
                  <Controller
                    control={control}
                    name={key}
                    render={({ field: controlledField }) => (
                      <Select value={controlledField.value || null} onValueChange={(value) => controlledField.onChange(value ?? '')}>
                        <SelectTrigger id={`field-${key}`} className="form-select" aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `field-${key}-error` : undefined}>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent align="start">
                          {field.options?.map((option) => <SelectItem value={option} key={option}>{option}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : field.type === 'textarea'
                  ? <Textarea {...shared} />
                  : <Input type={field.type} {...shared} />}
                {field.help && <p className="field-help">{field.help}</p>}
                {errors[key] && <small id={`field-${key}-error`}>{String(errors[key]?.message)}</small>}
              </div>
            );
          })}
          {fields.length === 0 && (
            <div className="confirmation-summary">
              <CheckCircle2 />
              <span><strong>Ready to continue</strong><small>No additional information is required for this prototype action.</small></span>
            </div>
          )}
          <DialogFooter className="action-dialog-footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{submitLabel}<ArrowRight data-icon="inline-end" /></Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
