import type { CSSProperties } from 'vue';
import type { VueTypeValidableDef, VueTypesInterface } from 'vue-types';
import VueTypes, { toType } from 'vue-types';
import type { VueNode } from '../type';

class ExtendedVueTypes extends VueTypes {
  static get looseBool() {
    return toType('looseBool', {
      type: Boolean,
      default: undefined,
    });
  }

  static get style() {
    return toType('style', {
      type: [String, Object],
      default: undefined,
    });
  }

  static get VueNode() {
    return toType('VueNode', {
      type: null,
    });
  }
}

export function withUndefined<T extends { default?: any }>(type: T): T {
  type.default = undefined;
  return type;
}
export default ExtendedVueTypes as VueTypesInterface & {
  readonly looseBool: VueTypeValidableDef<boolean>;
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VueNode: VueTypeValidableDef<VueNode>;
};
