/**
 * SVG 图标字符串净化。
 *
 * 部分组件允许调用方以字符串形式传入图标（通常是 SVG），并用 `innerHTML` 插入。
 * 若不做净化，传入任意 HTML 即可注入 `<script>` / `onerror` 等可执行内容（XSS）。
 * 这里只保留 SVG 根元素，剔除危险标签与事件属性。
 */

/** 不允许出现在图标中的标签 */
const FORBIDDEN_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'foreignobject',
  'animate',
  'set',
  'handler',
]);

/** 需要校验协议的属性 */
const URL_ATTRS = new Set(['href', 'xlink:href', 'src']);

/**
 * 净化传入的图标字符串，返回可安全用于 `innerHTML` 的 SVG。
 * 非 SVG 内容、SSR 环境或解析失败时返回空串（不渲染）。
 */
export function sanitizeSvgString(svg?: string | null): string {
  if (typeof document === 'undefined' || typeof svg !== 'string' || svg.trim() === '') {
    return '';
  }

  let root: Element | null = null;

  // 优先按 SVG 解析；失败时退回 HTML 解析并取其中的 svg 元素
  const xmlDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  if (xmlDoc.documentElement && xmlDoc.documentElement.nodeName !== 'parsererror') {
    root = xmlDoc.documentElement;
  } else {
    const htmlDoc = new DOMParser().parseFromString(svg, 'text/html');
    root = htmlDoc.body?.querySelector('svg') ?? null;
  }

  if (!root || root.nodeName.toLowerCase() !== 'svg') {
    return '';
  }

  const allNodes: Element[] = [root, ...Array.from(root.querySelectorAll('*'))];

  for (const node of allNodes) {
    if (FORBIDDEN_TAGS.has(node.nodeName.toLowerCase())) {
      node.remove();
      continue;
    }

    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      // 事件处理器一律移除
      if (name.startsWith('on')) {
        node.removeAttribute(attr.name);
        continue;
      }
      // 伪协议 URL 一律移除
      if (URL_ATTRS.has(name)) {
        const value = attr.value.replace(/[\u0000-\u0020\u007F-\u009F]/g, '').toLowerCase();
        if (value.startsWith('javascript:') || value.startsWith('data:')) {
          node.removeAttribute(attr.name);
        }
      }
    }
  }

  return root.outerHTML;
}

export default sanitizeSvgString;
