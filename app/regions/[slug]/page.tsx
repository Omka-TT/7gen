import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: region } = await supabase
    .from('regions')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!region) {
    notFound();
  }

  const { data: places } = await supabase
    .from('places')
    .select('*')
    .eq('region_id', region.id);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Все регионы
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-2">{region.name_ru}</h1>
      <p className="text-gray-600 mb-8">{region.description_ru}</p>

      <h2 className="text-xl font-semibold mb-4">Места в этом регионе</h2>

      {places && places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {places.map((place) => (
            <div key={place.id} className="border rounded-xl p-5">
              <h3 className="font-semibold">{place.name}</h3>
              <p className="text-sm text-gray-500">{place.type}</p>
              <p className="text-sm text-gray-600 mt-2">{place.description_ru}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Пока здесь нет добавленных мест.</p>
      )}
    </main>
  );
}