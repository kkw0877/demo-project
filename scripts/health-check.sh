#!/usr/bin/env bash
# 백엔드와 프론트엔드 서버 상태 확인

echo "=== 서버 상태 체크 ==="
echo ""

check_server() {
  local name="$1"
  local url="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "$url" 2>/dev/null || echo "000")
  if [[ "$code" =~ ^[23] ]]; then
    echo "✅ $name ($url) — HTTP $code"
  else
    echo "❌ $name ($url) — HTTP $code (응답 없음 또는 오류)"
  fi
}

check_server "Backend " "http://localhost:3001/"
check_server "Frontend" "http://localhost:5173/"
