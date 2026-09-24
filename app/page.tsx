import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data, error } = await supabase.from('regions').select('*');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Проверка связи с базой данных</h1>
      <p>Найдено регионов: {data?.length ?? 0}</p>
      {error && <p className="text-red-500">Ошибка: {error.message}</p>}
    </div>
  );
}