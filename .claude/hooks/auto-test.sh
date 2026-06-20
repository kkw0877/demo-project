#!/usr/bin/env bash
# PostToolUse 훅: frontend/src 파일 수정 후 vitest 자동 실행

TOOL_INPUT=$(cat)
FILE=$(echo "$TOOL_INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('file_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

if [[ "$FILE" == *"frontend/src"* ]]; then
  echo "[auto-test] $(basename "$FILE") 변경 감지 → 테스트 실행"
  REPO_ROOT="$(dirname "$0")/../.."
  cd "$REPO_ROOT/frontend" && npm run test 2>&1 | tail -20
fi
