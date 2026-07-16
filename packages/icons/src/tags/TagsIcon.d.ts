import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TagsIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TagsIcon: DefineComponent<TagsIcon>;
    }
}

export default TagsIcon;
