import { addComponent, addImports } from '@nuxt/kit';
import { isNotEmpty, isString, resolve } from '@xiaoye-ui/utils/object';
import type { MetaType } from '@xiaoye-ui/metadata';
import { components, composables, directives } from '@xiaoye-ui/metadata';
import type { ConstructsType, ModuleOptions, ResolvePathOptions } from './types';
import { Utils } from './utils';

function registerItems(items: any[] = [], options: ConstructsType = {}, params: any) {
    const included = resolve(options.include, params);
    const excluded = resolve(options.exclude, params);
    const isMatched = (name: string, tName: any) => name?.toLowerCase() === (isString(tName) ? tName?.toLowerCase() : tName?.name?.toLowerCase());

    return items.filter((item) => {
        const name = item?.name;
        const matchedIn = included === '*' || included === undefined ? true : isNotEmpty(included) ? included.some((inc: any) => isMatched(name, inc)) : false;
        const matchedEx = included === '*' && excluded === '*' ? false : excluded === '*' ? true : isNotEmpty(excluded) && Array.isArray(excluded) ? excluded.some((exc: any) => isMatched(name, exc)) : false;

        return matchedIn && !matchedEx;
    });
}

function registerConfig(resolvePath: any) {
    return [
        {
            name: 'XiaoyeUI',
            as: 'XiaoyeUI',
            from: resolvePath({ name: 'XiaoyeUI', as: 'XiaoyeUI', from: `xiaoye-ui/config`, type: 'config' })
        }
    ];
}

function isRegisteredMeta(item: MetaType | undefined): item is MetaType {
    return !!item?.name;
}

function registerComponents(resolvePath: any, moduleOptions: ModuleOptions): MetaType[] {
    const options: ConstructsType = moduleOptions.components || {};
    const items: MetaType[] = registerItems(components, options, { components });

    return items
        .map((item: MetaType): MetaType | undefined => {
            const _item = { ...item, name: item.name, as: item.name, from: item.from };
            const name = Utils.object.getName(_item, options);
            if (!name) return undefined;
            const from = resolvePath({ name, as: _item.as, from: _item.from, type: 'component' });
            const opt = {
                export: 'default',
                name,
                filePath: from,
                global: true
            };

            //!moduleOptions.autoImport && addComponent(opt);
            addComponent(opt);

            return {
                ..._item,
                ...opt
            };
        })
        .filter(isRegisteredMeta);
}

function registerDirectives(resolvePath: any, moduleOptions: ModuleOptions): MetaType[] {
    const options: ConstructsType = moduleOptions.directives || {};
    const items: MetaType[] = registerItems(directives, options, { directives });

    return items
        .map((item: MetaType): MetaType | undefined => {
            const name = Utils.object.getName(item, options);
            if (!name) return undefined;
            const opt = {
                ...item,
                name,
                from: resolvePath({ name, as: item.as, from: item.from, type: 'directive' })
            };

            return opt;
        })
        .filter(isRegisteredMeta);
}

function registerComposables(resolvePath: any, moduleOptions: ModuleOptions): MetaType[] {
    const options: ConstructsType = moduleOptions.composables || {};
    const items: MetaType[] = registerItems(composables, options, { composables });

    return items
        .map((item: MetaType): MetaType | undefined => {
            const name = item.name; //Utils.object.getName(item, options);
            if (!name) return undefined;
            const opt = {
                ...item,
                name,
                from: resolvePath({ name, as: item.as, from: item.from, type: 'composable' })
            };

            addImports(opt);

            return opt;
        })
        .filter(isRegisteredMeta);
}

function registerServices(resolvePath: any, registered: any) {
    const services: any = new Set<string>();

    registered?.components?.forEach((component: MetaType) => {
        if (component?.use?.as?.endsWith('Service')) {
            services.add(component.use.as);
        }
    });

    return [...services].map((service) => ({
        name: service,
        as: service,
        from: resolvePath({ name: service, as: service, from: `xiaoye-ui/${service.toLowerCase()}`, type: 'service' })
    }));
}

function registerStyles() {
    // Styles are now imported automatically by the auto-import resolver
    // via xiaoye-ui/<component>/style/index.js (which loads the .less files).
    return [];
}

function registerInjectStylesAsString(): string[] {
    return [];
}

function registerInjectStylesAsStringToTop(moduleOptions: ModuleOptions): string[] {
    return [Utils.object.createStyleAsString(moduleOptions.cssLayerOrder ? `@layer ${moduleOptions.cssLayerOrder}` : undefined, { name: 'layer-order' })];
}

export function register(moduleOptions: ModuleOptions) {
    const resolvePath = (resolveOptions: ResolvePathOptions) => Utils.object.getPath(moduleOptions.resolvePath, resolveOptions);

    const config = registerConfig(resolvePath);
    const components = registerComponents(resolvePath, moduleOptions);
    const directives = registerDirectives(resolvePath, moduleOptions);
    const composables = registerComposables(resolvePath, moduleOptions);
    const registered = {
        components,
        directives,
        composables
    };
    const services = registerServices(resolvePath, registered);
    const styles = registerStyles();
    const injectStylesAsString = registerInjectStylesAsString();
    const injectStylesAsStringToTop = registerInjectStylesAsStringToTop(moduleOptions);

    return {
        config,
        ...registered,
        services,
        styles,
        injectStylesAsString,
        injectStylesAsStringToTop
    };
}
