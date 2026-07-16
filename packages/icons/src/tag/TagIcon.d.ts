import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TagIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TagIcon: DefineComponent<TagIcon>;
    }
}

export default TagIcon;
