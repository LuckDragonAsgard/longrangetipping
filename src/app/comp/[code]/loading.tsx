export default function CompLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 mb-8">
        <div className="h-8 bg-[#1a1a3e] rounded w-72 mb-3" />
        <div className="h-4 bg-[#1a1a3e] rounded w-48 mb-6" />
        <div className="flex gap-8">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div className="h-8 bg-[#1a1a3e] rounded w-12 mb-1" />
              <div className="h-3 bg-[#1a1a3e] rounded w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-xl p-5 h-20" />
        ))}
      </div>
    </div>
  );
}
