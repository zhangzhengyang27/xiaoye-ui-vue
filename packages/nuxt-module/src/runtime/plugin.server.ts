import type { NitroApp } from 'nitropack/types';
import { getThemeCssString } from '@xiaoye-ui/core/config';
// @ts-expect-error - virtual module injected by nuxt module setup
import { styles, stylesToTop, themes } from '#xiaoye-ui-style';

type NitroAppPlugin = (nitro: NitroApp) => void;

interface NuxtRenderHTMLContext {
  htmlAttrs: string[];
  head: string[];
  bodyAttrs: string[];
  bodyPreprend: string[];
  body: string[];
  bodyAppend: string[];
}

const defineNitroPlugin = (def: NitroAppPlugin): NitroAppPlugin => def;

export default defineNitroPlugin(async nitroApp => {
  // C4: SSR FOUC 修复 —— 在首屏 HTML 中预注入 --xy-* 全局 CSS 变量。
  // 尝试从 runtime config 读取 theme.mode，默认 'light'。
  const xiaoyeUiConfig =
    (nitroApp as any).runtimeConfig?.public?.xiaoyeUi || (nitroApp as any).runtimeConfig?.xiaoyeUi;
  const mode = xiaoyeUiConfig?.options?.theme?.mode === 'dark' ? 'dark' : 'light';
  const globalThemeCss = getThemeCssString(mode);

  nitroApp.hooks.hook('render:html' as any, (html: NuxtRenderHTMLContext) => {
    html.head.unshift(stylesToTop);
    html.head.push(styles);
    html.head.push(themes);
    // C4: 注入全局 --xy-* CSS 变量，防止首屏 FOUC。
    // 使用与 registerCssVariables 相同的 id（'xy-global-theme-variables'），
    // 这样客户端 hydrate 时 registerCssVariables 会找到并更新该 <style>，
    // 而不是创建重复标签。
    html.head.unshift(`<style id="xy-global-theme-variables">${globalThemeCss}</style>`);
    html.htmlAttrs.push(`data-theme="${mode}"`);
    // TODO: CSS-in-JS 组件样式（extractStyle）尚未在 SSR 中注入。
    // 这需要在 Vue 渲染生命周期中收集 useStyleRegister 产生的样式，
    // 然后通过 html.head 注入。目前只注入全局 --xy-* 变量。
  });
});
