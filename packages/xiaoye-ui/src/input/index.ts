import type { App, Plugin } from 'vue';
import Input from './Input';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import Password from './Password';
import { registerComponent } from '../_util/registerComponent';
export type { InputProps, TextAreaProps } from './inputProps';
Input.Group = Group;
Input.Search = Search;
Input.TextArea = TextArea;
Input.Password = Password;

/* istanbul ignore next */
Input.install = function (app: App) {
  registerComponent(app, Input);
  registerComponent(app, Input.Group);
  registerComponent(app, Input.Search);
  registerComponent(app, Input.TextArea);
  registerComponent(app, Input.Password);
  return app;
};

export {
  Group as InputGroup,
  Search as InputSearch,
  TextArea as Textarea,
  Password as InputPassword,
};

export default Input as typeof Input &
  Plugin & {
    readonly Group: typeof Group;
    readonly Search: typeof Search;
    readonly TextArea: typeof TextArea;
    readonly Password: typeof Password;
  };
