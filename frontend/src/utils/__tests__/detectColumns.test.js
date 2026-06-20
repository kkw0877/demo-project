import { describe, it, expect } from 'vitest';
import { detectColumns } from '../detectColumns';

describe('detectColumns', () => {
  it('영어 표준 컬럼명을 감지한다', () => {
    const result = detectColumns(['Date', 'User', 'Message']);
    expect(result).toEqual({
      timestampKey: 'Date',
      senderKey: 'User',
      messageKey: 'Message',
    });
  });

  it('한국어 컬럼명을 감지한다', () => {
    const result = detectColumns(['날짜', '이름', '내용']);
    expect(result).toEqual({
      timestampKey: '날짜',
      senderKey: '이름',
      messageKey: '내용',
    });
  });

  it('대문자 컬럼명을 소문자로 변환하여 감지한다', () => {
    const result = detectColumns(['DATE', 'USER', 'MESSAGE']);
    expect(result).toEqual({
      timestampKey: 'DATE',
      senderKey: 'USER',
      messageKey: 'MESSAGE',
    });
  });

  it('앞뒤 공백이 있는 컬럼명을 trim 후 감지한다', () => {
    const result = detectColumns(['  date  ', '  user  ', '  message  ']);
    expect(result).toEqual({
      timestampKey: '  date  ',
      senderKey: '  user  ',
      messageKey: '  message  ',
    });
  });

  it('알 수 없는 컬럼명은 위치 기반으로 폴백한다', () => {
    const result = detectColumns(['col_a', 'col_b', 'col_c']);
    expect(result).toEqual({
      timestampKey: 'col_a',
      senderKey: 'col_b',
      messageKey: 'col_c',
    });
  });

  it('일부 컬럼만 매칭될 때 나머지는 폴백한다', () => {
    const result = detectColumns(['날짜', 'unknown', 'unknown2']);
    expect(result.timestampKey).toBe('날짜');
    expect(result.senderKey).toBe('unknown');
    expect(result.messageKey).toBe('unknown2');
  });

  it('다른 순서로 배치된 컬럼을 올바르게 감지한다', () => {
    const result = detectColumns(['User', 'Message', 'Date']);
    expect(result).toEqual({
      timestampKey: 'Date',
      senderKey: 'User',
      messageKey: 'Message',
    });
  });

  it('카카오톡 한국어 대안 컬럼명을 감지한다', () => {
    expect(detectColumns(['시간', '작성자', '텍스트'])).toEqual({
      timestampKey: '시간',
      senderKey: '작성자',
      messageKey: '텍스트',
    });
    expect(detectColumns(['time', 'sender', 'content'])).toEqual({
      timestampKey: 'time',
      senderKey: 'sender',
      messageKey: 'content',
    });
  });
});
