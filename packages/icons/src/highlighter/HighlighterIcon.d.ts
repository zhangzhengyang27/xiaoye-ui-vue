import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class HighlighterIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        HighlighterIcon: DefineComponent<HighlighterIcon>;
    }
}

export default HighlighterIcon;
