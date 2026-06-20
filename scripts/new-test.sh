#!/usr/bin/env bash
# 소스 파일에 대한 Vitest 테스트 파일 스캐폴드 생성
# 사용법: ./scripts/new-test.sh frontend/src/utils/detectColumns.js

set -e

cd "$(dirname "$0")/.."

SOURCE="$1"

if [ -z "$SOURCE" ]; then
  echo "사용법: $0 <소스파일 경로>"
  echo "예시:   $0 frontend/src/utils/myUtil.js"
  exit 1
fi

if [ ! -f "$SOURCE" ]; then
  echo "❌ 파일 없음: $SOURCE"
  exit 1
fi

BASENAME=$(basename "$SOURCE" | sed 's/\.[^.]*$//')
EXT=$(basename "$SOURCE" | sed 's/.*\.//')
DIR=$(dirname "$SOURCE")
TEST_DIR="$DIR/__tests__"
TEST_FILE="$TEST_DIR/$BASENAME.test.$EXT"

if [ -f "$TEST_FILE" ]; then
  echo "⚠️  이미 존재: $TEST_FILE"
  exit 0
fi

mkdir -p "$TEST_DIR"

cat > "$TEST_FILE" << TESTEOF
import { describe, it, expect } from 'vitest';
// import {  } from '../${BASENAME}';

describe('${BASENAME}', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
TESTEOF

echo "✅ 테스트 파일 생성: $TEST_FILE"
echo "   다음 단계: import 경로를 채우고 실제 테스트 케이스 작성"
