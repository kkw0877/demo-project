import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/analyze', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '메시지 데이터가 필요합니다.' });
  }

  // 토큰 초과 방지: 최근 300개 메시지만 분석
  const recentMessages = messages.slice(-300);

  const chatText = recentMessages
    .map((m) => `[${m.timestamp || ''}] ${m.message}`)
    .join('\n');

  const prompt = `당신은 개인 메모 분석 어시스턴트입니다.
아래는 카카오톡 나만의 채팅방에서 사용자가 저장한 개인 메모, 링크, 기록들입니다.

이 기록들을 분석하여 반드시 아래 JSON 형식으로만 응답하세요. JSON 외에 다른 텍스트는 포함하지 마세요:

{
  "summary": "전체 메모 요약 (어떤 종류의 기록들이 있는지, 주요 활동과 관심사, 기간 등 3-5줄)",
  "action_items": ["처리해야 할 것으로 보이는 항목들 - 약속, 연락처 저장, 체크리스트, 확인 사항, 해야 할 일 등 actionable한 것들만"],
  "topics": ["주요 관심사/활동 카테고리 키워드들 (예: 운동, AI개발, 투자, 부동산, 수학과외 등)"],
  "recent_highlights": [{"date": "날짜(YYYY-MM-DD)", "content": "중요해 보이는 메모 내용 한 줄 요약"}]
}

recent_highlights는 최근 날짜 기준으로 중요하거나 기억할 만한 메모 5개 이내로 선별하세요.

메모 내용:
${chatText}`;

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    let fullText = '';

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullText += event.delta.text;
        res.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done', fullText })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Claude API 오류:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Claude API 호출 중 오류가 발생했습니다.' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
      res.end();
    }
  }
});

app.listen(port, () => {
  console.log(`백엔드 서버 실행 중: http://localhost:${port}`);
});
