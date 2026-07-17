import type { App, Plugin } from 'vue';
import Avatar from './Avatar';
import Group from './Group';
import { registerComponent } from '../_util/registerComponent';
export { avatarProps } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';
export type { AvatarGroupProps } from './Group';

Avatar.Group = Group;

/* istanbul ignore next */
Avatar.install = function (app: App) {
  registerComponent(app, Avatar);
  registerComponent(app, Group);
  return app;
};
export { Group as AvatarGroup };
export default Avatar as typeof Avatar &
  Plugin & {
    readonly Group: typeof Group;
  };
