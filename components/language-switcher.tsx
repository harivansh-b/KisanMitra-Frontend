'use client';

import { useLanguage, Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-1 border rounded-lg p-1 bg-background shadow-sm text-xs font-semibold ${className}`}>
      <Globe className="h-3.5 w-3.5 text-primary ml-1 shrink-0" />
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md transition-colors ${
          language === 'en'
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('mr')}
        className={`px-2 py-1 rounded-md transition-colors ${
          language === 'mr'
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        मराठी
      </button>
    </div>
  );
}
