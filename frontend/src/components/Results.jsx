export default function Results({ data, streaming }) {
  if (!data && !streaming) return null;

  if (streaming) {
    return (
      <div className="mt-8 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-3">⏳</div>
          <p className="text-gray-600 font-medium">Claude가 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  const { summary, action_items, topics, recent_highlights } = data;

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">분석 결과</h2>

      {/* 1. 전체 메모 요약 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📝</span>
          <h3 className="text-lg font-semibold text-gray-800">전체 메모 요약</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
      </div>

      {/* 2. 처리해야 할 것들 */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📌</span>
          <h3 className="text-lg font-semibold text-gray-800">처리해야 할 것들</h3>
          {action_items?.length > 0 && (
            <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
              {action_items.length}개
            </span>
          )}
        </div>
        {action_items?.length > 0 ? (
          <ul className="space-y-2">
            {action_items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-0.5 shrink-0">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">처리해야 할 항목이 없습니다.</p>
        )}
      </div>

      {/* 3. 주요 관심사 & 카테고리 */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🏷️</span>
          <h3 className="text-lg font-semibold text-gray-800">주요 관심사 & 카테고리</h3>
        </div>
        {topics?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium px-3 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">카테고리를 찾을 수 없습니다.</p>
        )}
      </div>

      {/* 4. 최근 중요 메모 */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⭐</span>
          <h3 className="text-lg font-semibold text-gray-800">최근 중요 메모</h3>
        </div>
        {recent_highlights?.length > 0 ? (
          <div className="space-y-3">
            {recent_highlights.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="shrink-0 text-xs text-purple-500 font-medium pt-0.5 whitespace-nowrap">
                  {item.date}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">최근 중요 메모가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
