import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import { dict, pick } from '@/lib/i18n';
import { getLang } from '@/lib/i18n-server';

export const dynamic = 'force-dynamic';

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const tx = dict[lang];

  const { data: place } = await supabase.from('places').select('*').eq('id', id).single();
  if (!place) notFound();

  const categories = tx.categories as Record<string, string>;
  const telegram = place.contact_telegram?.replace(/^@/, '');

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/#map" className="text-sm font-medium text-neutral-500 transition-colors hover:text-red-600">
        {tx.place.back}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-800 md:h-[420px]">
            {place.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={place.image_url}
                alt={pick(place, 'name', lang)}
                className="animate-image-in h-full w-full object-cover"
              />
            )}
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-red-600">
              {categories[place.type] ?? place.type}
            </span>
          </div>

          <h1 className="mt-8 font-heading text-4xl font-extrabold text-neutral-900 md:text-5xl">
            {pick(place, 'name', lang)}
          </h1>

          <h2 className="mt-8 font-heading text-lg font-bold text-neutral-900">{tx.place.about}</h2>
          <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-neutral-600">
            {pick(place, 'description', lang)}
          </p>
        </div>

        <aside className="h-fit rounded-3xl border border-red-100 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(210,39,48,0.35)] lg:sticky lg:top-24">
          <dl className="mb-6 space-y-3 text-sm">
            {place.price_range && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{tx.place.price}</dt>
                <dd className="font-semibold text-neutral-900">{place.price_range}</dd>
              </div>
            )}
            {place.contact_phone && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{tx.place.phone}</dt>
                <dd>
                  <a href={`tel:${place.contact_phone}`} className="font-semibold text-red-600 hover:underline">
                    {place.contact_phone}
                  </a>
                </dd>
              </div>
            )}
            {telegram && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Telegram</dt>
                <dd>
                  <a href={`https://t.me/${telegram}`} className="font-semibold text-red-600 hover:underline">
                    @{telegram}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <h2 className="font-heading text-lg font-bold text-neutral-900">{tx.place.request}</h2>
          <p className="mb-4 mt-1 text-sm text-neutral-500">{tx.place.requestHint}</p>
          <LeadForm placeId={place.id} labels={tx.form} />
        </aside>
      </div>
    </main>
  );
}

