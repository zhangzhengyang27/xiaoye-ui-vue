/**
 * URL 安全校验工具。
 *
 * 组件库多处把用户传入的 `url` 直接塞进 `<a href={...}>`，若值为 `javascript:` /
 * `data:` / `vbscript:` 等危险协议，点击即执行脚本，造成 XSS。
 *
 * 这里用「协议白名单」思路：只允许相对路径与少量安全协议，其余一律拒绝。
 * 实现只做字符串正则判断，不依赖 `new URL` 或 `window`，可在 SSR 环境安全工作。
 */

/** 允许的导航协议白名单 */
const SAFE_URL_PROTOCOLS = ['http', 'https', 'mailto', 'tel'];

/** 提取 URL 开头的 scheme（如 `javascript:`），不区分大小写 */
const URL_SCHEME_REGEX = /^([a-z0-9.+-]+):/i;

/**
 * 判断一个 URL 是否为安全的导航目标。
 *
 * - `null` / `undefined` / 空字符串 → 视为「无链接」（返回 false）
 * - 无 scheme（相对路径、`#` 锚点、`./` `../` `//` 协议相对）→ 安全
 * - scheme 命中白名单 → 安全
 * - `javascript:` / `data:` / `vbscript:` 等 → 不安全
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url) {
    return false;
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return false;
  }

  const match = URL_SCHEME_REGEX.exec(trimmed);

  // 没有 scheme 视为相对路径 / 锚点，安全
  if (!match) {
    return true;
  }

  return SAFE_URL_PROTOCOLS.includes(match[1].toLowerCase());
}

/**
 * 安全化一个 URL：
 * - 安全（含空值 / 相对路径 / 白名单协议）→ 返回原值
 * - 不安全（危险协议）→ 返回 `undefined`，用于「不渲染 href」以中和导航
 */
export function sanitizeUrl(url?: string | null): string | undefined {
  return isSafeUrl(url) ? (url ?? undefined) : undefined;
}

export default sanitizeUrl;
