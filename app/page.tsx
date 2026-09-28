import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import MapWrapper from '@/components/Map/MapWrapper';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: regions } = await supabase
    .from('regions')
    .select('*')
    .order('name_ru');

  const { data: placesRaw } = await supabase
    .from('places')
    .select('*, region:regions(slug)');

  const places = placesRaw?.map((p: any) => ({
    ...p,
    region_slug: p.region?.slug,
  }));

  return (
    <main>
      <div className="h-[88vh] w-full">
        <MapWrapper places={places || []} />
      </div>

      <div id="regions" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          Все регионы
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {regions?.map((region) => (
            <Link
              key={region.id}
              href={`/regions/${region.slug}`}
              className="border border-red-200 bg-white rounded-xl p-5 hover:border-red-500 hover:shadow-[0_0_20px_rgba(210,39,48,0.12)] transition-all block"
            >
              <h3 className="text-lg font-semibold mb-2 text-black">{region.name_ru}</h3>
              <p className="text-gray-500 text-sm">{region.description_ru}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}