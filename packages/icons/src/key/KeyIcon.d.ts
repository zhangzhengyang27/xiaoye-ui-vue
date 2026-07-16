import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class KeyIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        KeyIcon: DefineComponent<KeyIcon>;
    }
}

export default KeyIcon;
