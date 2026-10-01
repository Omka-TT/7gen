type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

export default function CoverImage({ src, alt, className = '' }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`object-cover ${className}`} />;
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white/70 ${className}`}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19l6-10 4 6 2-3 6 7H3z" />
      </svg>
    </div>
  );
}