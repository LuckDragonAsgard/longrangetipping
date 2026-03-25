export default function TipsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-[#111128] rounded w-48 mb-2" />
      <div className="h-4 bg-[#111128] rounded w-64 mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4 h-20" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-4 h-16 mb-4" />
        ))}
      </div>
    </div>
  );
}
