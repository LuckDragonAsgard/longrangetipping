import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🏈</div>
        <h1 className="text-5xl font-black mb-4">
          <span className="gradient-text">404</span>
        </h1>
        <p className="text-xl text-[#a0a0cc] mb-8">
          Looks like that kick went out on the full.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Back to Home</Link>
          <Link href="/browse" className="btn-secondary">Browse Comps</Link>
        </div>
      </div>
    </div>
  );
}
