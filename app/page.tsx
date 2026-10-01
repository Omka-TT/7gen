import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CoverImage from '@/components/CoverImage';
import { dict, pick } from '@/lib/i18n';
import { getLang } from '@/lib/i18n-server';

export const dynamic = 'force-dynamic';

// Заполните этими путями, когда добавите свои файлы в /public
// Видео: /public/videos/hero.mp4 → HERO_VIDEO_URL = '/videos/hero.mp4'
// Постер (кадр на время загрузки видео): /public/images/hero-poster.jpg → HERO_POSTER_URL = '/images/hero-poster.jpg'
const HERO_VIDEO_URL = '/videos/hero.mp4';
const HERO_POSTER_URL = '';

export default async function Home() {
  const lang = await getLang();
  const tx = dict[lang];
  const categories = tx.categories as Record<string, string>;

  const [{ data: regionsRaw }, { data: placesRaw }] = await Promise.all([
  supabase
    .from('regions')
    .select('slug, name_ru, name_en, name_ky, description_ru, description_en, description_ky, cover_image')
    .order('name_ru'),
  supabase.from('places').select('*, region:regions(slug)'),
]);

const places = (placesRaw ?? []).map((p: any) => ({
  id: p.id,
  type: p.type,
  name: pick(p, 'name', lang),
  description: pick(p, 'description', lang),
  image_url: p.image_url ?? null,
  price_range: p.price_range ?? null,
  region_slug: p.region?.slug,
}));

// Только регионы, в которых уже есть хотя бы одно место — пустые области на витрину не попадают
const regionsWithPlaces = new Set(places.map((p) => p.region_slug).filter(Boolean));
const regions = (regionsRaw ?? []).filter((r: any) => regionsWithPlaces.has(r.slug));

  const regionsCount = regions.length;
  const placesCount = places.length;

  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section className="relative flex h-[92vh] min-h-[560px] items-end overflow-hidden bg-neutral-900 text-white">
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER_URL || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : HERO_POSTER_URL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={HERO_POSTER_URL} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-neutral-900 to-black" />
            <svg
              className="absolute inset-x-0 bottom-0 h-1/2 w-full text-black/40"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0 300 L150 120 L300 220 L430 60 L560 200 L700 90 L850 210 L1000 100 L1200 240 L1200 300 Z" />
            </svg>
          </>
        )}

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-400">{tx.hero.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] md:text-6xl">
            {tx.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{tx.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 font-semibold text-white transition-all hover:bg-red-500 hover:shadow-xl"
            >
              {tx.hero.cta}
              <span aria-hidden>→</span>
            </Link>

            <p className="text-sm text-white/70">
              {regionsCount} {tx.stats.regions} · {placesCount} {tx.stats.places} · 3 {tx.stats.languages}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- КУДА ПОЕХАТЬ ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">{tx.destinations.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold text-neutral-900 md:text-4xl">
          {tx.destinations.title}
        </h2>
        <p className="mt-3 max-w-xl text-neutral-500">{tx.destinations.subtitle}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.slice(0, 6).map((region: any) => (
            <Link
              key={region.slug}
              href={`/regions/${region.slug}`}
              className="group relative h-64 overflow-hidden rounded-2xl"
            >
              <CoverImage
                src={region.cover_image}
                alt={pick(region, 'name', lang)}
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-heading text-xl font-bold text-white">{pick(region, 'name', lang)}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/80">{pick(region, 'description', lang)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/map" className="inline-flex items-center gap-2 font-semibold text-red-600 hover:underline">
            {tx.destinations.cta} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ---------- ПОПУЛЯРНЫЕ МЕСТА ---------- */}
      {places.length > 0 && (
        <section className="bg-red-50/60 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">{tx.featured.eyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-neutral-900 md:text-4xl">
              {tx.featured.title}
            </h2>

            <div className="mt-10 overflow-hidden">
  <div className="animate-marquee flex w-max gap-6">
    {[...places, ...places].map((place, i) => (
      <Link
        key={`${place.id}-${i}`}
        href={`/places/${place.id}`}
        className="group w-72 shrink-0 overflow-hidden rounded-2xl border border-red-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
      >
        <div className="relative h-44 overflow-hidden">
          <CoverImage
            src={place.image_url}
            alt={place.name}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-red-600">
            {categories[place.type] ?? place.type}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-heading text-base font-bold text-neutral-900">{place.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{place.description}</p>
        </div>
      </Link>
    ))}
  </div>
</div>
          </div>
        </section>
      )}

      {/* ---------- ЦИФРЫ ---------- */}
      <section className="bg-[#D22730] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            [regionsCount, tx.stats.regions],
            [placesCount, tx.stats.places],
            [3, tx.stats.languages],
            ['24/7', tx.stats.always],
          ].map(([value, label], i) => (
            <div key={i} className="text-center">
              <p className="font-heading text-4xl font-extrabold md:text-5xl">{value}</p>
              <p className="mt-2 text-sm text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- КАК ЭТО РАБОТАЕТ ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">{tx.how.eyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold text-neutral-900 md:text-4xl">
          {tx.how.title}
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {tx.how.steps.map((step, i) => (
            <div key={i} className="relative rounded-2xl border border-red-100 bg-white p-6">
              <span className="font-heading text-5xl font-extrabold text-red-600/15">0{i + 1}</span>
              <h3 className="mt-4 font-heading text-lg font-bold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ПОЧЕМУ МЫ ---------- */}
      <section id="why" className="scroll-mt-20 bg-red-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">{tx.why.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold text-neutral-900 md:text-4xl">
            {tx.why.title}
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tx.why.items.map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-red-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
              >
                <span className="font-heading text-4xl font-extrabold text-red-600/20 transition-colors group-hover:text-red-600">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ФИНАЛЬНЫЙ ПРИЗЫВ ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 text-center text-white md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-700/30 via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl font-extrabold md:text-4xl">{tx.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">{tx.cta.subtitle}</p>
            <Link
              href="/map"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 font-semibold text-white transition-all hover:bg-red-500 hover:shadow-xl"
            >
              {tx.cta.button} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


