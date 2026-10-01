import { supabase } from '@/lib/supabase';
import MapWrapper from '@/components/Map/MapWrapper';
import { dict, pick } from '@/lib/i18n';
import { getLang } from '@/lib/i18n-server';

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const lang = await getLang();
  const tx = dict[lang];

  const [{ data: regions }, { data: placesRaw }] = await Promise.all([
    supabase.from('regions').select('slug, name_ru, name_en, name_ky'),
    supabase.from('places').select('*, region:regions(slug)'),
  ]);

  const regionNames: Record<string, string> = Object.fromEntries(
    (regions ?? []).map((r: any) => [r.slug, pick(r, 'name', lang)])
  );

  const places = (placesRaw ?? []).map((p: any) => ({
    id: p.id,
    type: p.type,
    lat: p.lat,
    lng: p.lng,
    name: pick(p, 'name', lang),
    description: pick(p, 'description', lang),
    image_url: p.image_url ?? null,
    price_range: p.price_range ?? null,
    region_slug: p.region?.slug,
  }));

  const labels = {
    ...tx.map,
    categories: tx.categories as Record<string, string>,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">{tx.hero.eyebrow}</p>
      <h1 className="mt-2 font-heading text-3xl font-extrabold text-neutral-900 md:text-4xl">
        {tx.nav.map}
      </h1>

      <div className="relative mt-8 h-[80vh] min-h-[520px] overflow-hidden rounded-3xl border border-red-100 shadow-[0_20px_60px_-20px_rgba(210,39,48,0.3)]">
        <MapWrapper places={places} regionNames={regionNames} labels={labels} lang={lang} />
      </div>
    </main>
  );
}

