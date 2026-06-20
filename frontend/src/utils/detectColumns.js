export function detectColumns(fields) {
  const lower = fields.map((f) => f.toLowerCase().trim());
  return {
    timestampKey: fields[lower.findIndex((f) => ['timestamp', 'time', 'date', '시간', '날짜'].includes(f))] || fields[0],
    senderKey:    fields[lower.findIndex((f) => ['sender', 'name', '이름', '작성자', 'user', '발신자'].includes(f))] || fields[1],
    messageKey:   fields[lower.findIndex((f) => ['message', 'content', '내용', '메시지', 'text', '텍스트'].includes(f))] || fields[2],
  };
}
