# Architecture

## Structure

```
backend/    — Express API server (port 3001)
frontend/   — React + Vite app (port 5173)
```

Vite proxies `/api/*` to the backend, so there is no hardcoded backend URL in the frontend source.

## Data Flow

1. User uploads a KakaoTalk CSV → `FileUpload` parses it with PapaParse into `{timestamp, sender, message}[]`
2. `App` POSTs up to the most recent 300 messages to `POST /api/analyze`
3. Backend builds a structured prompt and streams Claude's response back as SSE
4. `App` reads the `ReadableStream` manually, accumulates tokens, then JSON-parses the final result
5. `Results` renders the structured output
