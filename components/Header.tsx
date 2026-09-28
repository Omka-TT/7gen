import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-red-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span className="text-lg font-bold tracking-tight text-black">
            7<span className="text-red-600">Gen</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Карта
          </Link>
          <Link href="/#regions" className="hover:text-red-600 transition-colors">
            Регионы
          </Link>
        </nav>
      </div>
    </header>
  );
}