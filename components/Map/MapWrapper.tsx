'use client';

import dynamic from 'next/dynamic';

const KyrgyzstanMap = dynamic(() => import('./KyrgyzstanMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      Загрузка карты...
    </div>
  ),
});

export default function MapWrapper(props: any) {
  return <KyrgyzstanMap {...props} />;
}