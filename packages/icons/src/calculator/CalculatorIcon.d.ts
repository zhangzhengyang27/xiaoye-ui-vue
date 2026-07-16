import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CalculatorIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CalculatorIcon: DefineComponent<CalculatorIcon>;
    }
}

export default CalculatorIcon;
