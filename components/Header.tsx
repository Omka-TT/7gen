'use client';

import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { dict, type Lang } from '@/lib/i18n';

export default function Header({ lang }: { lang: Lang }) {
  const tx = dict[lang];
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[2000] border-b border-red-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
          <span className="font-heading text-xl font-extrabold tracking-tight text-neutral-900">
            7<span className="text-red-600">Gen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-600 sm:flex">
          <Link
            href="/"
            className="rounded transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500"
          >
            {tx.nav.home}
          </Link>
          <Link
            href="/map"
            className="rounded transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500"
          >
            {tx.nav.map}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher current={lang} />

          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-neutral-700 sm:hidden"
            aria-label="Меню"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-red-100 bg-white px-4 py-3 sm:hidden">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-red-50 hover:text-red-600"
          >
            {tx.nav.home}
          </Link>
          <Link
            href="/map"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-red-50 hover:text-red-600"
          >
            {tx.nav.map}
          </Link>
        </nav>
      )}
    </header>
  );
}