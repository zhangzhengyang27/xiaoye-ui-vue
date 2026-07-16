import defaultAlgorithm from '../theme/themes/default';
import darkAlgorithm from '../theme/themes/dark';

/**
 * 应用主题模式到 document root
 */
export const applyTheme = (mode: 'light' | 'dark' = 'light') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
};

/**
 * 注册 CSS 变量（应用主题模式）
 */
export const registerCssVariables = (mode: 'light' | 'dark' = 'light') => {
  applyTheme(mode);
};

/**
 * 获取主题 CSS 变量字符串（无副作用，仅返回字符串）
 */
export const getThemeCssString = (mode: 'light' | 'dark' = 'light'): string => {
  const lightVars = [
    '--xy-primary-color: #1677ff',
    '--xy-success-color: #52c41a',
    '--xy-warning-color: #faad14',
    '--xy-error-color: #ff4d4f',
    '--xy-info-color: #1677ff',
    '--xy-body-background: #ffffff',
    '--xy-text-color: rgba(0, 0, 0, 0.88)',
    '--xy-border-color: #d9d9d9',
  ];

  const darkVars = [
    '--xy-primary-color: #1668dc',
    '--xy-success-color: #49aa19',
    '--xy-warning-color: #d89614',
    '--xy-error-color: #dc4446',
    '--xy-info-color: #1668dc',
    '--xy-body-background: #141414',
    '--xy-text-color: rgba(255, 255, 255, 0.88)',
    '--xy-border-color: #434343',
  ];

  const vars = mode === 'dark' ? darkVars : lightVars;
  return vars.join('; ') + ';';
};

export default {
  defaultAlgorithm,
  darkAlgorithm,
};
