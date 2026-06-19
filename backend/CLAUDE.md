# backend/CLAUDE.md

## Commands

```bash
npm run dev    # node --watch index.js (auto-restart on change)
npm start      # node index.js (production)
```

## Environment

Copy `.env.example` to `.env` and set:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001          # optional, defaults to 3001
```

## API

### `POST /api/analyze`

**Request body:**
```json
{ "messages": [{ "timestamp": "...", "sender": "...", "message": "..." }] }
```

**Behavior:**
- Caps input at the most recent 300 messages to avoid token overflow
- Calls `claude-sonnet-4-6` with `max_tokens: 2048`
- Requires Claude to respond in JSON-only format (no prose)
- Streams response back as SSE

**SSE event format:**
```
data: {"type": "delta", "text": "..."}   // incremental token
data: {"type": "done", "fullText": "..."}  // final accumulated text
data: {"type": "error", "message": "..."}  // on Claude API error
```

**Claude response schema (enforced via prompt):**
```json
{
  "summary": "string",
  "action_items": ["string"],
  "topics": ["string"],
  "recent_highlights": [{ "date": "YYYY-MM-DD", "content": "string" }]
}
```
