import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BookIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    BookIcon: DefineComponent<BookIcon>;
  }
}

export default BookIcon;
