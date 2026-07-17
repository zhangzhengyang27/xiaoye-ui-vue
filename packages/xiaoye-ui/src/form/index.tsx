import type { App, Plugin } from 'vue';
import Form, { formProps } from './Form';
import FormItem, { formItemProps } from './FormItem';
import useForm from './useForm';
import FormItemRest, { useInjectFormItemContext } from './FormItemContext';
import { registerComponent } from '../_util/registerComponent';
export type { Rule, RuleObject } from './interface';

export type { FormProps, FormInstance } from './Form';
export type { FormItemProps, FormItemInstance } from './FormItem';

Form.useInjectFormItemContext = useInjectFormItemContext;
Form.ItemRest = FormItemRest;
/* istanbul ignore next */
Form.install = function (app: App) {
  registerComponent(app, Form);
  registerComponent(app, Form.Item);
  registerComponent(app, FormItemRest);
  return app;
};

export { FormItem, formItemProps, formProps, FormItemRest, useForm, useInjectFormItemContext };

export default Form as typeof Form &
  Plugin & {
    readonly Item: typeof Form.Item;
    readonly ItemRest: typeof FormItemRest;
    readonly useForm: typeof useForm;
    readonly useInjectFormItemContext: typeof useInjectFormItemContext;
  };
