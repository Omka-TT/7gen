import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dict, pick } from '@/lib/i18n';
import { getLang } from '@/lib/i18n-server';

export const dynamic = 'force-dynamic';

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const tx = dict[lang];

  const { data: region } = await supabase.from('regions').select('*').eq('slug', slug).single();
  if (!region) notFound();

  const { data: places } = await supabase.from('places').select('*').eq('region_id', region.id);

  const categories = tx.categories as Record<string, string>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/#map" className="text-sm font-medium text-neutral-500 transition-colors hover:text-red-600">
        {tx.region.back}
      </Link>

      <h1 className="mt-4 font-heading text-4xl font-extrabold text-neutral-900 md:text-5xl">
        {pick(region, 'name', lang)}
      </h1>
      <p className="mt-3 max-w-2xl text-neutral-500">{pick(region, 'description', lang)}</p>

      <h2 className="mb-6 mt-12 flex items-center gap-2 font-heading text-xl font-bold text-neutral-900">
        <span className="h-2 w-2 rounded-full bg-red-600" />
        {tx.region.places}
      </h2>

      {places && places.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place: any) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group overflow-hidden rounded-2xl border border-red-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-red-600 to-red-800">
                {place.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={place.image_url}
                    alt={pick(place, 'name', lang)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-red-600">
                  {categories[place.type] ?? place.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-neutral-900">{pick(place, 'name', lang)}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-500">{pick(place, 'description', lang)}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-red-600">{tx.region.more} →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">{tx.region.empty}</p>
      )}
    </main>
  );
}

