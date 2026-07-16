import type { XiaoyeUIConfiguration } from 'xiaoye-ui/config';

export interface ConstructsType {
  prefix?: string | undefined;
  name?: (item: any) => string | undefined;
  include?:
    | '*'
    | Array<string | { name: string; use?: { as: string } }>
    | ((list: any) => string[] | undefined)
    | undefined;
  exclude?:
    | '*'
    | Array<string | { name: string; use?: { as: string } }>
    | ((list: any) => string[] | undefined)
    | undefined;
}

export interface ModuleOptions {
  useXiaoyeUI?: boolean;
  autoImport?: boolean;
  resolvePath?: any;
  /*cssLayerOrder?: string;*/
  loadStyles?: boolean;
  options?: XiaoyeUIOptions;
  cssLayerOrder?: string;
  components?: ConstructsType;
  directives?: ConstructsType;
  composables?: Omit<ConstructsType, 'prefix'>;
}

export interface XiaoyeUIOptions extends XiaoyeUIConfiguration {}

export interface ResolvePathOptions {
  name?: string;
  as?: string;
  from: string;
  type?: 'config' | 'component' | 'directive' | 'composable' | 'service' | 'style' | undefined;
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    xiaoyeUi?: ModuleOptions;
  }
  interface NuxtOptions {
    xiaoyeUi?: ModuleOptions;
  }
}
