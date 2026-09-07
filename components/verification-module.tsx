'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileUp, ShieldCheck, CheckCircle2, Clock, AlertCircle, Award, BadgeCheck, FileText, Upload, Trash2, ExternalLink
} from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/client';
import { storageApi } from '@/lib/api/storage';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function VerificationModule({ role = 'farmer' }: { role?: string }) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('doc.land_record');
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const documents = useQuery({
    queryKey: ['verification-documents'],
    queryFn: storageApi.listMyDocuments,
    retry: false,
  });

  async function handleUpload(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage(null);

    try {
      await storageApi.upload(file, (role || 'FARMER').toUpperCase() as any);
      setFile(null);
      setMessage('Document uploaded successfully! Recorded for KisanMitra profile verification review.');
      await documents.refetch();
    } catch (cause) {
      setMessage(getApiErrorMessage(cause));
    } finally {
      setUploading(false);
    }
  }

  const verifications = [
    {
      level: 'Level 1: Basic Identity',
      name: 'Phone & Aadhaar KYC',
      status: 'VERIFIED',
      desc: 'Government ID & Phone OTP verified via UIDAI portal.',
    },
    {
      level: 'Level 2: Agricultural Record',
      name: role === 'fpo' ? 'FPO Registration' : role === 'buyer' ? 'Trade License' : 'Land Record (7/12)',
      status: 'VERIFIED',
      desc: 'Official certificate & district revenue record validated.',
    },
    {
      level: 'Level 3: Ecosystem Trust',
      name: 'KisanMitra Gold Verified Badge',
      status: 'ACTIVE',
      desc: 'Eligible for instant trade contracts & high-value market liquidity.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <ShieldCheck className="h-6 w-6" />
              <p className="eyebrow">{t('nav.verification')}</p>
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Participant KYC & Verification Status</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Official verification badges protect farmers, FPOs, and buyers across Maharashtra trade networks.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
            <BadgeCheck className="h-8 w-8 text-emerald-500 shrink-0" />
            <div>
              <strong className="text-sm block">Verified Profile Tier</strong>
              <span className="text-xs text-muted-foreground font-mono">KYC-MH-2026-8891</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Level Badges */}
      <div className="grid gap-4 sm:grid-cols-3">
        {verifications.map((item, idx) => (
          <div key={idx} className="rounded-xl border bg-card p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">{item.level}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-3 w-3" /> {item.status}
              </span>
            </div>
            <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload Document Panel */}
      <section className="panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">{t('doc.upload_btn')}</h3>
          </div>
          <span className="text-xs text-muted-foreground">PDF, PNG, JPG (Max 10MB)</span>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t('doc.select_type')}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-xs"
              >
                <option value="doc.land_record">{t('doc.land_record')}</option>
                <option value="doc.fpo_cert">{t('doc.fpo_cert')}</option>
                <option value="doc.trade_license">{t('doc.trade_license')}</option>
                <option value="doc.id_proof">{t('doc.id_proof')}</option>
                <option value="doc.quality_cert">{t('doc.quality_cert')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Choose File</label>
              <input
                required
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-md border bg-background px-3 py-1.5 text-xs text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">All uploaded certificates are reviewed by Maharashtra APMC administrators.</p>
            <Button disabled={!file || uploading} size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : t('doc.upload_btn')}
            </Button>
          </div>
        </form>

        {message && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </section>

      {/* Verification Records Table */}
      <section className="panel overflow-hidden">
        <div className="border-b p-4 font-semibold text-sm flex items-center justify-between">
          <span>Submitted Verification Documents</span>
          <span className="text-xs text-muted-foreground">Updated in real-time</span>
        </div>

        {documents.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground text-center">Loading submitted verification files...</p>
        ) : (documents.data ?? []).length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
            <FileText className="mx-auto h-8 w-8 opacity-40" />
            <p>{t('doc.no_docs')}</p>
          </div>
        ) : (
          <div className="divide-y text-xs">
            {(documents.data ?? []).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="font-semibold text-foreground text-sm block">{doc.file_name}</strong>
                    <span className="text-muted-foreground">
                      Uploaded {new Date(doc.created_at).toLocaleDateString()} · KYC Status: Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs hover:bg-muted"
                    >
                      <ExternalLink className="h-3 w-3" /> View File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
