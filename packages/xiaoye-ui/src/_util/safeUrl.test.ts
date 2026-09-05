import { describe, expect, it, vi } from 'vitest';
import { isSafeUrl, openSafeWindow, safeUrl } from './safeUrl';

describe('safeUrl', () => {
  describe('isSafeUrl', () => {
    it('放行白名单协议', () => {
      expect(isSafeUrl('https://example.com')).toBe(true);
      expect(isSafeUrl('http://example.com/a?b=1')).toBe(true);
      expect(isSafeUrl('mailto:a@b.com')).toBe(true);
      expect(isSafeUrl('tel:+8613800000000')).toBe(true);
    });

    it('放行相对路径', () => {
      expect(isSafeUrl('/foo/bar')).toBe(true);
      expect(isSafeUrl('#anchor')).toBe(true);
      expect(isSafeUrl('//cdn.example.com/a.png')).toBe(true);
    });

    it('拦截脚本类伪协议', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('JaVaScRiPt:alert(1)')).toBe(false);
      expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
      expect(isSafeUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
      expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    });

    it('拦截利用空白与控制字符绕过协议检测', () => {
      expect(isSafeUrl(' javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('java\nscript:alert(1)')).toBe(false);
      expect(isSafeUrl('java\tscript:alert(1)')).toBe(false);
      expect(isSafeUrl('\u0000javascript:alert(1)')).toBe(false);
    });

    it('空值与非字符串一律不安全', () => {
      expect(isSafeUrl('')).toBe(false);
      expect(isSafeUrl(undefined)).toBe(false);
      expect(isSafeUrl(null)).toBe(false);
      expect(isSafeUrl(123 as unknown as string)).toBe(false);
    });
  });

  describe('safeUrl', () => {
    it('安全时原样返回', () => {
      expect(safeUrl('https://example.com')).toBe('https://example.com');
    });

    it('不安全时回退到 fallback', () => {
      expect(safeUrl('javascript:alert(1)')).toBe('');
      expect(safeUrl('javascript:alert(1)', '#')).toBe('#');
    });
  });

  describe('openSafeWindow', () => {
    it('不安全时不调用 window.open', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
      expect(openSafeWindow('javascript:alert(1)')).toBeNull();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('安全时带上 noopener,noreferrer', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
      openSafeWindow('https://example.com');
      expect(spy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
      spy.mockRestore();
    });
  });
});
