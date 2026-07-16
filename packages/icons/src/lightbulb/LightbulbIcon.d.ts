import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LightbulbIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        LightbulbIcon: DefineComponent<LightbulbIcon>;
    }
}

export default LightbulbIcon;
