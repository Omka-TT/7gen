import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data: regions } = await supabase
    .from('regions')
    .select('*')
    .order('name_ru');

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Туризм в Кыргызстане</h1>
      <p className="text-gray-500 mb-8">Выберите область, чтобы узнать больше</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {regions?.map((region) => (
          <div
            key={region.id}
            className="border rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{region.name_ru}</h2>
            <p className="text-gray-600 text-sm">{region.description_ru}</p>
          </div>
        ))}
      </div>
    </main>
  );
}