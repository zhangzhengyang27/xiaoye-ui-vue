import { components, directives } from '@xiaoye-ui/metadata';
import type { MetaType } from '@xiaoye-ui/metadata';
import type { ComponentResolver, ComponentResolveResult } from 'unplugin-vue-components/types';

export interface XiaoyeUIResolverOptions {
  components?: {
    prefix?: string;
  };
  directives?: {
    prefix?: string;
  };
  resolve?: (meta: MetaType, type: string) => ComponentResolveResult;
}

export function XiaoyeUIResolver(options: XiaoyeUIResolverOptions = {}): ComponentResolver[] {
  const getName = (name: string, prefix?: string) => {
    if (prefix) {
      if (!name.startsWith(prefix)) return;

      name = name.substring(prefix.length);
    }

    return name;
  };

  return [
    {
      type: 'component',
      resolve: (name: string) => {
        const { prefix } = options.components || {};
        const cName = getName(name, prefix);
        const cMeta = components.find(
          c => c.name.toLocaleLowerCase() === cName?.toLocaleLowerCase(),
        );

        if (cMeta) {
          return (
            options?.resolve?.(cMeta, 'component') ??
            ({
              from: cMeta.from,
              sideEffects:
                cMeta.sideEffects !== undefined
                  ? cMeta.sideEffects
                  : `xiaoye-ui/${cMeta.from.split('/').pop()?.toLowerCase()}/style`,
            } as ComponentResolveResult)
          );
        }
      },
    },
    {
      type: 'directive',
      resolve: (name: string) => {
        const { prefix } = options.directives || {};
        const dName = getName(name, prefix);
        const dMeta = directives.find(
          d => d.name.toLocaleLowerCase() === dName?.toLocaleLowerCase(),
        );

        if (dMeta) {
          return (
            options?.resolve?.(dMeta, 'directive') ?? {
              as: dMeta.as,
              from: dMeta.from,
            }
          );
        }
      },
    },
  ];
}
