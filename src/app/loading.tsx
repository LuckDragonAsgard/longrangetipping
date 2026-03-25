export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-[#111128] rounded-xl w-64 mb-4" />
      <div className="h-4 bg-[#111128] rounded w-96 mb-8" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-6 h-24" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 h-32" />
        ))}
      </div>
    </div>
  );
}
