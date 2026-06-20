#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

echo "=== 환경 체크 ==="

ERRORS=0

# backend/.env 존재 확인
if [ ! -f backend/.env ]; then
  echo "❌ backend/.env 없음 → cp backend/.env.example backend/.env 후 API 키 설정"
  ERRORS=$((ERRORS + 1))
else
  # ANTHROPIC_API_KEY 설정 확인
  API_KEY=$(grep -E '^ANTHROPIC_API_KEY=' backend/.env | cut -d= -f2- | tr -d '"'"'" 2>/dev/null || echo "")
  if [ -z "$API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY 미설정"
    ERRORS=$((ERRORS + 1))
  elif [ "$API_KEY" = "your_api_key_here" ]; then
    echo "❌ ANTHROPIC_API_KEY 가 플레이스홀더 그대로 (your_api_key_here)"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ ANTHROPIC_API_KEY 설정됨"
  fi
fi

# node_modules 확인
if [ ! -d backend/node_modules ]; then
  echo "❌ backend/node_modules 없음 → cd backend && npm install"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ backend/node_modules 존재"
fi

if [ ! -d frontend/node_modules ]; then
  echo "❌ frontend/node_modules 없음 → cd frontend && npm install"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ frontend/node_modules 존재"
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ 모든 환경 체크 통과"
else
  echo "❌ $ERRORS 개 문제 발견 — 위 항목 확인 후 재시도"
  exit 1
fi
