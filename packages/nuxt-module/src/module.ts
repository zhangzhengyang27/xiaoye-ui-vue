import { addPlugin, addPluginTemplate, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit';
import { isNotEmpty } from '@xiaoye-ui/utils';
import { XiaoyeUIResolver } from '@xiaoye-ui/auto-import-resolver';
import type { MetaType } from '@xiaoye-ui/metadata';
import Components from 'unplugin-vue-components/nuxt';
import { register } from './register';
import type { ModuleOptions } from './types';

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@xiaoye-ui/nuxt-module',
        configKey: 'xiaoyeUi',
        compatibility: {
            nuxt: '>=3.0.0'
        }
    },
    defaults: {
        useXiaoyeUI: true,
        autoImport: true,
        resolvePath: undefined,
        loadStyles: true,
        options: {},
        components: {
            prefix: '',
            name: undefined,
            include: undefined,
            exclude: undefined
        },
        directives: {
            prefix: '',
            name: undefined,
            include: undefined,
            exclude: undefined
        },
        composables: {
            name: undefined,
            include: undefined,
            exclude: undefined
        }
    },
    hooks: {},
    setup(moduleOptions, nuxt) {
        moduleOptions.components = moduleOptions.components || {};
        moduleOptions.directives = moduleOptions.directives || {};
        moduleOptions.composables = moduleOptions.composables || {};
        moduleOptions.components.exclude = moduleOptions.components.exclude || ['Editor', 'Chart'];

        const resolver = createResolver(import.meta.url);
        const registered = register(moduleOptions);
        const { autoImport, loadStyles } = moduleOptions;

        const runtimeConfig = {
            ...moduleOptions,
            useXiaoyeUI: moduleOptions.useXiaoyeUI ?? true,
            autoImport: moduleOptions.autoImport ?? true,
            loadStyles: moduleOptions.loadStyles ?? true,
            options: moduleOptions.options ?? {},
            ...registered
        };

        nuxt.options.runtimeConfig.public.xiaoyeUi = runtimeConfig as typeof nuxt.options.runtimeConfig.public.xiaoyeUi;

        nuxt.options.build.transpile.push('xiaoye-ui');

        if (autoImport) {
            const dts = isNotEmpty(moduleOptions.components?.prefix) || isNotEmpty(moduleOptions.directives?.prefix);

            Components(
                {
                    dts,
                    resolvers: [
                        XiaoyeUIResolver({
                            components: moduleOptions.components,
                            directives: moduleOptions.directives
                        })
                    ]
                },
                nuxt
            );
        }

        const styleContent = () => {
            if (!loadStyles) return `export const styles = [], stylesToTop = [], themes = [];`;

            return `
const stylesToTop = [${registered.injectStylesAsStringToTop.join('')}].join('');
const styles = [${registered.injectStylesAsString.join('')}].join('');
const themes = [];

export { styles, stylesToTop, themes };
`;
        };

        nuxt.options.alias['#xiaoye-ui-style'] = addTemplate({
            filename: 'xiaoye-ui-style.mjs',
            getContents: styleContent
        }).dst;

        addPlugin(resolver.resolve('./runtime/plugin.client'));

        addPluginTemplate({
            filename: 'xiaoye-ui-plugin.mjs',
            getContents() {
                return `
import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
${registered.config.map((config: MetaType) => `import ${config.as} from '${config.from}';`).join('\n')}
${registered.services.map((service: MetaType) => `import ${service.as} from '${service.from}';`).join('\n')}
${!autoImport && registered.directives.map((directive: MetaType) => `import ${directive.as} from '${directive.from}';`).join('\n')}

export default defineNuxtPlugin(({ vueApp }) => {
  const runtimeConfig = useRuntimeConfig();
  const config = runtimeConfig?.public?.xiaoyeUi ?? {};
  const { useXiaoyeUI = true, options = {} } = config;

  useXiaoyeUI && vueApp.use(XiaoyeUI, options);
  ${registered.services.map((service: MetaType) => `vueApp.use(${service.as});`).join('\n')}
  ${!autoImport && registered.directives.map((directive: MetaType) => `vueApp.directive('${directive.name}', ${directive.as});`).join('\n')}
});
        `;
            }
        });

        nuxt.hook('nitro:config' as any, async (config: any) => {
            config.externals = config.externals || {};
            config.externals.inline = config.externals.inline || [];
            config.externals.inline.push(resolver.resolve('./runtime/plugin.server'));
            // C4: 确保 @xiaoye-ui/core 被 Nitro 打包（而非 external），
            // 以便 server plugin 能 import getThemeCssString
            config.externals.inline.push('@xiaoye-ui/core');
            config.virtual = config.virtual || {};
            // Server-side styles are handled by client-side Vite/Less imports;
            // avoid importing .less files into the Nitro server bundle.
            config.virtual['#xiaoye-ui-style'] = () => `export const styles = [], stylesToTop = [], themes = [];`;
            config.plugins = config.plugins || [];
            config.plugins.push(resolver.resolve('./runtime/plugin.server'));
        });
    }
});
