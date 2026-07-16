import dayjs from 'dayjs';
import MockDate from 'mockdate';
import { nextTick } from 'vue';
import { vi } from 'vitest';

export function setMockDate(dateString = '2017-09-18T03:30:07.795') {
  MockDate.set(dayjs(dateString));
}

export function resetMockDate() {
  MockDate.reset();
}

export async function asyncExpect(fn, timeout) {
  if (typeof timeout === 'number') {
    if (typeof vi !== 'undefined' && vi.isFakeTimers && vi.isFakeTimers()) {
      vi.advanceTimersByTime(timeout);
      await Promise.resolve();
      return fn();
    }
    await new Promise(resolve => setTimeout(resolve, timeout));
    return fn();
  }
  await nextTick();
  return fn();
}
export const sleep = (timeout = 0) => new Promise(resolve => setTimeout(resolve, timeout));
