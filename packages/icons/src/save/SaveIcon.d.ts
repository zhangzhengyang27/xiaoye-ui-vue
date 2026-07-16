import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SaveIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SaveIcon: DefineComponent<SaveIcon>;
    }
}

export default SaveIcon;
