import type { App } from 'vue';
import Layout, { Header, Footer, Content } from './layout';
import Sider from './Sider';
import { registerComponent } from '../_util/registerComponent';

export type { BasicProps as LayoutProps } from './layout';
export type { SiderProps } from './Sider';

/* istanbul ignore next */
export const LayoutHeader = Header;
export const LayoutFooter = Footer;
export const LayoutSider = Sider;
export const LayoutContent = Content;

export default Object.assign(Layout, {
  Header,
  Footer,
  Content,
  Sider,
  install: (app: App) => {
    registerComponent(app, Layout);
    registerComponent(app, Header);
    registerComponent(app, Footer);
    registerComponent(app, Sider);
    registerComponent(app, Content);
    return app;
  },
});
