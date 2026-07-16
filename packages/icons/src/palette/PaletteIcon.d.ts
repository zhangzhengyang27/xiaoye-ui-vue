import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PaletteIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PaletteIcon: DefineComponent<PaletteIcon>;
    }
}

export default PaletteIcon;
