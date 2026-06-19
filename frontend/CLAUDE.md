# frontend/CLAUDE.md

## Commands

```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
```

## API Proxy

Vite dev server proxies `/api/*` → `http://localhost:3001` (`vite.config.js`). No hardcoded backend URL anywhere in the source — always use `/api/...`.

## Component Structure

```
src/
  App.jsx           — root state, SSE streaming logic
  components/
    FileUpload.jsx  — CSV parsing, column detection
    Results.jsx     — renders structured Claude output
```

### FileUpload

Uses PapaParse. Column detection is heuristic — matches common Korean/English header names (`Date`/`시간`, `User`/`이름`, `Message`/`내용`) and falls back to positional columns (0, 1, 2).

### App — SSE streaming

Does **not** use `EventSource`. Reads `response.body` as a `ReadableStream` manually to support `POST`. After streaming completes, extracts JSON from the accumulated text with `/\{[\s\S]*\}/` before parsing.

### Results

Expects `data` prop shaped as:
```ts
{
  summary: string
  action_items: string[]
  topics: string[]
  recent_highlights: { date: string; content: string }[]
}
```
