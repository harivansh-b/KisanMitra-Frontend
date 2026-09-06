'use client';

import { useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { api, getApiErrorMessage } from '@/lib/api/client';

type ChatResult = { answer: string };

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); if (!message.trim()) return;
    setSending(true); setError(null);
    try { setAnswer((await api.post<ChatResult>('/chat', { message: message.trim(), language: 'auto', history: [] })).answer); }
    catch (cause) { setError(getApiErrorMessage(cause)); }
    finally { setSending(false); }
  }
  return <div className="fixed bottom-5 right-5 z-40">
    {open && <section className="mb-3 w-[min(24rem,calc(100vw-2.5rem))] rounded-xl border bg-popover p-4 shadow-xl" aria-label="Market data assistant">
      <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-primary" />Market data assistant</div><p className="mt-1 text-xs text-muted-foreground">Answers use the marketplace database.</p></div><button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button></div>
      {answer && <p className="mt-3 max-h-48 overflow-y-auto rounded-md bg-muted/50 p-3 text-sm leading-6">{answer}</p>}{error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <form onSubmit={submit} className="mt-3 flex gap-2"><input aria-label="Ask the market assistant" value={message} onChange={(event) => setMessage(event.target.value)} className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm" placeholder="Ask about prices or demand" /><button type="submit" disabled={sending} className="rounded-md bg-primary px-3 text-primary-foreground disabled:opacity-60"><Send className="h-4 w-4" /></button></form>
    </section>}
    <button type="button" aria-label="Open market assistant" onClick={() => setOpen((value) => !value)} className="ml-auto flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg"><MessageCircle className="h-5 w-5" />Ask KisanMitra</button>
  </div>;
}
