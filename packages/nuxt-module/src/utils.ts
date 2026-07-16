import { createStyleAsString } from '@xiaoye-ui/utils/dom';
import { isFunction } from '@xiaoye-ui/utils/object';
import type { MetaType } from '@xiaoye-ui/metadata';
import type { ConstructsType, ResolvePathOptions } from './types';

export const Utils = {
    object: {
        getName(item: MetaType, options: ConstructsType) {
            return isFunction(options?.name) ? options.name(item) : `${options.prefix}${item.name}`;
        },
        getPath(fn: any, options: ResolvePathOptions) {
            return isFunction(fn) ? fn(options) : options.from;
        },
        createStyleAsString(css: string | undefined, options = { name: '' }) {
            const { name, ...rest } = options;

            return createStyleAsString(css, { 'data-xiaoyeUi-style-id': name, ...rest });
        }
    }
};
