import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class QuoteIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        QuoteIcon: DefineComponent<QuoteIcon>;
    }
}

export default QuoteIcon;
