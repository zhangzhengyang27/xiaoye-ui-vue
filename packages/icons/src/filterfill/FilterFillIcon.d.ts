import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FilterFillIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterFillIcon: DefineComponent<FilterFillIcon>;
    }
}

export default FilterFillIcon;
