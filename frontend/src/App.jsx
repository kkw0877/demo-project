import { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import Results from './components/Results.jsx';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');

  const handleParsed = (msgs, name) => {
    setMessages(msgs);
    setFileName(name);
    setResult(null);
    setError('');
  };

  const analyze = async () => {
    if (!messages.length) return;

    setStreaming(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '서버 오류');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = JSON.parse(line.slice(6));

          if (json.type === 'delta') {
            fullText += json.text;
          } else if (json.type === 'done') {
            fullText = json.fullText || fullText;
          } else if (json.type === 'error') {
            throw new Error(json.message);
          }
        }
      }

      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('분석 결과를 파싱할 수 없습니다.');
      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed);
    } catch (err) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">나만의 채팅방 분석기</h1>
          <p className="text-gray-500 mt-2">카카오톡 나만의 채팅방 CSV를 업로드하면 Claude가 메모를 분석해드립니다</p>
        </div>

        {/* 파일 업로드 */}
        <FileUpload onParsed={handleParsed} />

        {/* 메시지 미리보기 */}
        {messages.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{fileName}</span> —{' '}
              {messages.length}개 메시지 로드됨
            </p>
            <div className="mt-2 max-h-32 overflow-y-auto text-xs text-gray-500 space-y-1">
              {messages.slice(0, 5).map((m, i) => (
                <p key={i} className="truncate">
                  [{m.timestamp}] <span className="text-gray-700 font-medium">{m.sender}</span>: {m.message}
                </p>
              ))}
              {messages.length > 5 && (
                <p className="text-gray-400">... 외 {messages.length - 5}개</p>
              )}
            </div>
          </div>
        )}

        {/* 분석 버튼 */}
        {messages.length > 0 && (
          <button
            onClick={analyze}
            disabled={streaming}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {streaming ? '분석 중...' : '🔍 대화 분석하기'}
          </button>
        )}

        {/* 에러 */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* 결과 */}
        <Results data={result} streaming={streaming} />
      </div>
    </div>
  );
}
