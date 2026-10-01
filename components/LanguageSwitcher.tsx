'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const OPTIONS = [
  { code: 'ky', label: 'КЫР' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
];

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (code: string) => {
    if (code === current) return;
    document.cookie = `lang=${code}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div className={`flex rounded-full border border-red-200 bg-white p-1 ${pending ? 'opacity-60' : ''}`}>
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          onClick={() => change(o.code)}
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-colors ${
            current === o.code ? 'bg-red-600 text-white' : 'text-neutral-600 hover:text-red-600'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}