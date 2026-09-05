/**
 * URL 安全校验工具。
 *
 * 组件内部会把外部传入的 URL 用于 `href` / `src` / `window.open`，
 * 若不校验协议，攻击者可传入 `javascript:` / `data:` / `vbscript:` 等伪协议执行脚本（XSS）。
 * 统一收敛到此处做白名单校验，避免各组件各写一套。
 */

/** 允许用于跳转/引用的安全协议 */
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:', 'sms:', 'ftp:']);

/** 协议提取：先剔除空白与控制字符，防范 `java\nscript:` / ` javascript:` 一类绕过 */
const PROTOCOL_RE = /^([a-z][a-z0-9+\-.]*):/;

function extractProtocol(url: string): string {
  const cleaned = url.replace(/[\u0000-\u0020\u007F-\u009F]/g, '').toLowerCase();
  const matched = PROTOCOL_RE.exec(cleaned);
  return matched ? `${matched[1]}:` : '';
}

/**
 * 判断 URL 是否安全可用。
 * 相对路径（无协议，如 `/foo`、`#anchor`、`//cdn.com/a.png`）视为安全。
 */
export function isSafeUrl(url?: string | null): boolean {
  if (typeof url !== 'string' || url === '') {
    return false;
  }
  const protocol = extractProtocol(url);
  // 无协议即相对路径，交给浏览器按当前页面基址解析，不会执行脚本
  if (!protocol) {
    return true;
  }
  return SAFE_PROTOCOLS.has(protocol);
}

/**
 * 返回可安全用于 `href` / `src` 的 URL，不安全时回退到 fallback。
 */
export function safeUrl(url?: string | null, fallback = ''): string {
  return isSafeUrl(url) ? (url as string) : fallback;
}

/**
 * 安全打开新窗口：校验协议并强制 `noopener,noreferrer`，
 * 避免 `javascript:` 执行与反向标签劫持（tabnabbing）。
 */
export function openSafeWindow(url?: string | null, target = '_blank'): Window | null {
  if (!isSafeUrl(url)) {
    return null;
  }
  return window.open(url as string, target, 'noopener,noreferrer');
}

export default isSafeUrl;
