import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SearchMinusIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SearchMinusIcon: DefineComponent<SearchMinusIcon>;
  }
}

export default SearchMinusIcon;
