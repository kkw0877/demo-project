#!/usr/bin/env bash
# POST /api/analyze 엔드포인트를 샘플 메시지로 테스트
# 서버가 실행 중이어야 함 (npm run dev 또는 scripts/dev.sh)

PORT="${1:-3001}"
URL="http://localhost:$PORT/api/analyze"

echo "=== API 테스트: POST $URL ==="
echo ""

curl -N -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"timestamp": "2024-01-15 10:00", "sender": "나", "message": "마트에서 사과, 우유, 계란 사야 함"},
      {"timestamp": "2024-01-15 10:05", "sender": "나", "message": "내일 오전 10시 팀 회의 준비 - 발표 자료 만들기"},
      {"timestamp": "2024-01-15 14:00", "sender": "나", "message": "병원 예약 2월 3일 오후 2시"},
      {"timestamp": "2024-01-16 09:00", "sender": "나", "message": "독서: 클린 코드 3장까지 읽기"},
      {"timestamp": "2024-01-16 11:00", "sender": "나", "message": "운동 루틴 - 월수금 저녁 7시 헬스장"},
      {"timestamp": "2024-01-17 08:30", "sender": "나", "message": "택배 도착 예정 - 집에 있어야 함"},
      {"timestamp": "2024-01-17 15:00", "sender": "나", "message": "친구 생일 선물 아이디어: 책, 향수, 커피 쿠폰"},
      {"timestamp": "2024-01-18 10:00", "sender": "나", "message": "이번 달 예산 정리 - 식비 초과 주의"}
    ]
  }'

echo ""
echo ""
echo "=== 완료 ==="
