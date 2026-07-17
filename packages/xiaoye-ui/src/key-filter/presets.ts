// KeyFilter 9 种预设正则常量
// 与源项目 DEFAULT_PATTERNS 保持一致，匹配单字符
export const DEFAULT_PATTERNS = {
  // 正整数（仅数字）
  pint: /[\d]/,
  // 整数（数字 + 负号）
  int: /[\d-]/,
  // 正数（数字 + 小数点）
  pnum: /[\d.]/,
  // 金额（数字 + 小数点 + 空格 + 逗号）
  money: /[\d.\s,]/,
  // 数字（数字 + 小数点 + 负号）
  num: /[\d-.]/,
  // 十六进制（0-9, a-f, 忽略大小写）
  hex: /[0-9a-f]/i,
  // 邮箱（字母数字 + _.-@）
  email: /[a-z0-9_.-@]/i,
  // 字母（字母 + 下划线）
  alpha: /[a-z_]/i,
  // 字母数字（字母数字 + 下划线）
  alphanum: /[a-z0-9_]/,
} as const;

export type KeyFilterPresetName = keyof typeof DEFAULT_PATTERNS;

// 根据预设名获取正则；不存在返回 null
export function getPresetRegex(name: string): RegExp | null {
  return DEFAULT_PATTERNS[name as KeyFilterPresetName] || null;
}
