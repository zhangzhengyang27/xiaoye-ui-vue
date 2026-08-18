import { describe, it, expect, afterEach } from 'vitest';
import { nextTick, ref } from 'vue';
import ConfigProvider, { globalConfigForApi, resolveGlobalTheme } from '../index';
import theme from '../../theme';

const { darkAlgorithm, defaultAlgorithm } = theme;

// 清空全局残留，避免影响其他测试
afterEach(() => {
  ConfigProvider.config({});
});

describe('resolveGlobalTheme', () => {
  it('returns undefined when no theme provided', () => {
    expect(resolveGlobalTheme()).toBeUndefined();
    expect(resolveGlobalTheme({})).toBeUndefined();
  });

  it('maps legacy CSS-variable theme colors to tokens', () => {
    const resolved = resolveGlobalTheme({ primaryColor: '#0EA5E9' });
    expect(resolved).toEqual({ token: { colorPrimary: '#0EA5E9' } });
    expect(resolved?.algorithm).toBeUndefined();
  });

  it('maps all legacy colors and lets processingColor override primaryColor', () => {
    const resolved = resolveGlobalTheme({
      primaryColor: '#1890ff',
      processingColor: '#0EA5E9',
      infoColor: '#13c2c2',
      successColor: '#52c41a',
      warningColor: '#faad14',
      errorColor: '#f5222d',
    });
    expect(resolved?.token).toEqual({
      colorPrimary: '#0EA5E9',
      colorInfo: '#13c2c2',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#f5222d',
    });
  });

  it('keeps modern ThemeConfig untouched', () => {
    const theme = {
      algorithm: darkAlgorithm,
      token: { colorPrimary: '#0EA5E9', borderRadius: 4 },
      components: { Button: { colorPrimary: '#123456' } },
      hashed: true,
    };
    expect(resolveGlobalTheme(theme)).toEqual(theme);
  });

  it('merges modern token with legacy colors, legacy wins on conflicts', () => {
    const resolved = resolveGlobalTheme({
      token: { colorPrimary: '#111111' },
      primaryColor: '#222222',
      algorithm: darkAlgorithm,
    });
    expect(resolved?.token).toEqual({ colorPrimary: '#222222' });
    expect(resolved?.algorithm).toBe(darkAlgorithm);
  });
});

describe('ConfigProvider.config global theme', () => {
  it('registers modern ThemeConfig into globalConfigForApi', async () => {
    ConfigProvider.config({
      theme: {
        algorithm: darkAlgorithm,
        token: { colorPrimary: '#0EA5E9' },
      },
    });
    await nextTick();
    expect(globalConfigForApi.theme?.algorithm).toBe(darkAlgorithm);
    expect(globalConfigForApi.theme?.token?.colorPrimary).toBe('#0EA5E9');
  });

  it('reactively follows a Ref theme', async () => {
    const themeRef = ref({
      algorithm: defaultAlgorithm,
      token: { colorPrimary: '#1890ff' },
    });
    ConfigProvider.config({ theme: themeRef });
    await nextTick();
    expect(globalConfigForApi.theme?.token?.colorPrimary).toBe('#1890ff');

    themeRef.value = {
      algorithm: darkAlgorithm,
      token: { colorPrimary: '#0EA5E9' },
    };
    await nextTick();
    expect(globalConfigForApi.theme?.algorithm).toBe(darkAlgorithm);
    expect(globalConfigForApi.theme?.token?.colorPrimary).toBe('#0EA5E9');
  });

  it('accepts legacy theme and registers CSS variables', async () => {
    ConfigProvider.config({ theme: { primaryColor: '#123456' } });
    await nextTick();
    expect(globalConfigForApi.theme?.token?.colorPrimary).toBe('#123456');
    // registerTheme 注入 --xy-primary-color CSS 变量
    const rootStyle = Array.from(document.querySelectorAll('style')).find(s =>
      s.innerHTML.includes('--xy-primary-color'),
    );
    expect(rootStyle).toBeTruthy();
    expect(rootStyle!.innerHTML).toContain('#123456');
  });

  it('can switch between dark and light algorithms', async () => {
    const themeRef = ref({
      algorithm: defaultAlgorithm,
    });
    ConfigProvider.config({ theme: themeRef });
    await nextTick();
    expect(globalConfigForApi.theme?.algorithm).toBe(defaultAlgorithm);

    themeRef.value = { algorithm: darkAlgorithm };
    await nextTick();
    expect(globalConfigForApi.theme?.algorithm).toBe(darkAlgorithm);
  });
});
