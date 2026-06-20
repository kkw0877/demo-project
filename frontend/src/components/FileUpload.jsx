import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { detectColumns } from '../utils/detectColumns';

export default function FileUpload({ onParsed }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const parseFile = (file) => {
    setError('');
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (!rows.length) {
          setError('CSV 파일이 비어 있습니다.');
          return;
        }

        const fields = results.meta.fields || [];
        const { timestampKey, senderKey, messageKey } = detectColumns(fields);

        const messages = rows.map((r) => ({
          timestamp: r[timestampKey] || '',
          sender: r[senderKey] || '알 수 없음',
          message: r[messageKey] || '',
        })).filter((m) => m.message.trim());

        if (!messages.length) {
          setError('유효한 메시지를 찾지 못했습니다. CSV 컬럼을 확인해주세요.');
          return;
        }

        onParsed(messages, file.name);
      },
      error: () => {
        setError('CSV 파싱 중 오류가 발생했습니다.');
      },
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="text-gray-600 font-medium">
          CSV 파일을 드래그하거나 클릭해서 업로드
        </p>
        <p className="text-gray-400 text-sm mt-1">
          카카오톡 내보내기: Date, User, Message 컬럼
        </p>
        {fileName && (
          <p className="text-blue-600 text-sm mt-2 font-medium">✓ {fileName}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files[0] && parseFile(e.target.files[0])}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
