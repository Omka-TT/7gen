import { supabase } from '@/lib/supabase';
import MapWrapper from '@/components/Map/MapWrapper';

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const { data: places } = await supabase.from('places').select('*');

  return (
    <main className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Карта Кыргызстана</h1>
      </div>
      <div className="flex-1">
        <MapWrapper places={places || []} />
      </div>
    </main>
  );
}