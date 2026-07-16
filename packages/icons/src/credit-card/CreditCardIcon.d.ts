import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CreditCardIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CreditCardIcon: DefineComponent<CreditCardIcon>;
  }
}

export default CreditCardIcon;
