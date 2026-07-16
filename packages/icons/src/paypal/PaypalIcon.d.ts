import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PaypalIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    PaypalIcon: DefineComponent<PaypalIcon>;
  }
}

export default PaypalIcon;
