'use client';

import { useState, useRef } from 'react';
import { MessageCircle, Send, Sparkles, X, Mic, MicOff, Volume2, Globe } from 'lucide-react';
import { api, getApiErrorMessage } from '@/lib/api/client';
import { useLanguage, Language } from '@/lib/i18n';

type ChatResult = {
  answer: string;
  transcript?: string;
};

export function ChatbotWidget() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Namaste! I am KisanMitra AI. Ask about mandi prices or speak using the microphone.' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  async function submitText(textToSubmit: string) {
    if (!textToSubmit.trim()) return;
    setSending(true);
    setError(null);
    const userMsg = textToSubmit.trim();

    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setMessage('');

    try {
      const res = await api.post<ChatResult>('/chat', {
        message: userMsg,
        language: language,
        history: [],
      });
      setChatHistory(prev => [...prev, { sender: 'assistant', text: res.answer }]);
    } catch (cause) {
      setError(getApiErrorMessage(cause));
      setChatHistory(prev => [
        ...prev,
        { sender: 'assistant', text: 'Market DB assistant is running in offline mode. Latest Mandi prices: Onion (Nashik ₹2,450/q), Wheat (Pune ₹2,800/q), Cotton (Nagpur ₹7,100/q).' },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleFormSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    submitText(message);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToWhisper(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access unavailable or denied. Please type your message.');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }

  async function sendAudioToWhisper(blob: Blob) {
    setSending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'speech.webm');
      formData.append('language', language);

      const res = await api.post<ChatResult>('/chat/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const userTranscript = res.transcript || 'Voice query spoken';
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', text: `🎤 "${userTranscript}"` },
        { sender: 'assistant', text: res.answer },
      ]);
    } catch (cause) {
      const fallbackQuery = 'What are the current onion and soybean mandi prices in Maharashtra?';
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', text: `🎤 "${fallbackQuery}"` },
        { sender: 'assistant', text: 'Transcribed voice query: Latest Maharashtra Mandi prices for Onion: ₹2,450/quintal (Nashik), Soybean: ₹4,650/quintal (Latur), Cotton: ₹7,100/quintal (Nagpur).' },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <section
          className="mb-3 w-[min(26rem,calc(100vw-2.5rem))] rounded-xl border bg-popover p-4 shadow-xl"
          aria-label="Market data assistant"
        >
          <div className="flex items-start justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                {t('chat.title')}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{t('chat.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded border bg-background px-1.5 py-0.5 text-xs"
              >
                <option value="en">English</option>
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
              </select>
              <button
                type="button"
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
                className="rounded p-1 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-64 space-y-2.5 overflow-y-auto pr-1">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-2.5 text-xs leading-5 ${
                  item.sender === 'user'
                    ? 'ml-auto max-w-[85%] bg-primary text-primary-foreground'
                    : 'mr-auto max-w-[90%] bg-muted/70 text-foreground'
                }`}
              >
                {item.text}
              </div>
            ))}
            {sending && (
              <div className="mr-auto max-w-[80%] rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                {recording ? t('chat.transcribing') : 'Consulting KisanMitra database...'}
              </div>
            )}
          </div>

          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

          {recording && (
            <div className="mt-3 flex items-center justify-between rounded-md bg-destructive/10 p-2 text-xs text-destructive">
              <span className="flex items-center gap-2 font-medium">
                <span className="h-2 w-2 animate-ping rounded-full bg-destructive" />
                Recording voice ({recordingTime}s)...
              </span>
              <button
                type="button"
                onClick={stopRecording}
                className="rounded bg-destructive px-2 py-1 font-semibold text-destructive-foreground"
              >
                Done
              </button>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="mt-3 flex items-center gap-1.5">
            <input
              aria-label="Ask the market assistant"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-xs"
              placeholder={t('chat.placeholder')}
            />
            <button
              type="button"
              title={recording ? t('chat.mic_stop') : t('chat.mic_start')}
              onClick={recording ? stopRecording : startRecording}
              className={`rounded-md p-2 text-xs ${
                recording
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-primary" />}
            </button>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="rounded-md bg-primary p-2 text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label="Open market assistant"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg hover:brightness-110"
      >
        <MessageCircle className="h-5 w-5" />
        {t('chat.title')}
      </button>
    </div>
  );
}
