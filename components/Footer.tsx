import Link from 'next/link';
import { dict, type Lang } from '@/lib/i18n';

// ЗАМЕНИТЕ на свои реальные контакты
const EMAIL = 'your-email@example.com';
const TELEGRAM_HANDLE = 'your_telegram';

const TELEGRAM_URL = 'https://t.me/' + TELEGRAM_HANDLE;
const TELEGRAM_LABEL = '@' + TELEGRAM_HANDLE;
const MAILTO_URL = 'mailto:' + EMAIL;

export default function Footer({ lang }: { lang: Lang }) {
  const tx = dict[lang];

  return (
    <footer className="bg-[#D22730] text-white mt-2"> 
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl font-extrabold">7Gen</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
            {tx.footer.tagline}
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-white/60">
            {tx.footer.navTitle}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#map" className="text-white/90 hover:text-white hover:underline">
                {tx.nav.map}
              </Link>
            </li>
            <li>
              <Link href="/#why" className="text-white/90 hover:text-white hover:underline">
                {tx.nav.why}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-white/60">
            {tx.footer.contactTitle}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={MAILTO_URL} className="text-white/90 hover:text-white hover:underline">
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={TELEGRAM_URL} className="text-white/90 hover:text-white hover:underline">
                {TELEGRAM_LABEL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/70">
          © {new Date().getFullYear()} 7Gen. {tx.footer.rights}
        </p>
      </div>
    </footer>
  );
}

