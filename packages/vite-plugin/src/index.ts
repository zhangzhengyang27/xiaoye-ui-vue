import { XiaoyeUIResolver } from '@xiaoye-ui/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import type { Plugin } from 'vite';

export interface XiaoyeUIVitePluginOptions {
    /**
     * Whether to auto import XiaoyeUI components and directives.
     * @default true
     */
    autoImport?:
        | boolean
        | {
              components?: {
                  prefix?: string;
              };
              directives?: {
                  prefix?: string;
              };
          };
}

export function XiaoyeUIVitePlugin(options: XiaoyeUIVitePluginOptions = {}): Plugin[] {
    const { autoImport = true } = options;
    const plugins: Plugin[] = [];

    if (autoImport) {
        const resolverOptions = typeof autoImport === 'object' ? autoImport : {};

        plugins.push(
            Components({
                dts: true,
                resolvers: [XiaoyeUIResolver(resolverOptions)]
            }) as unknown as Plugin
        );
    }

    return plugins;
}

export default XiaoyeUIVitePlugin;
