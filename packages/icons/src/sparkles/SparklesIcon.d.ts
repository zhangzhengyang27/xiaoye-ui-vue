import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SparklesIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SparklesIcon: DefineComponent<SparklesIcon>;
    }
}

export default SparklesIcon;
