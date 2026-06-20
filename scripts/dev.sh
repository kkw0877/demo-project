#!/usr/bin/env bash
# backend와 frontend를 동시에 기동. Ctrl+C 하나로 둘 다 종료.
set -e

cd "$(dirname "$0")/.."

trap 'echo ""; echo "서버 종료 중..."; kill 0' SIGINT SIGTERM

echo "Backend (port 3001) 와 Frontend (port 5173) 기동 중..."
(cd backend && npm run dev 2>&1 | sed 's/^/[BE] /') &
(cd frontend && npm run dev 2>&1 | sed 's/^/[FE] /') &

wait
