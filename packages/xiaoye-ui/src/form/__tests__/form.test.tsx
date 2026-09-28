import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { defineComponent, h, reactive } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import Form from '../index';
import Input from '../../input';

const USERNAME_RULES = [{ required: true, message: '请输入用户名' }];

function makeForm(options: Record<string, any> = {}) {
  const onFinish = options.onFinish ?? vi.fn();
  const onFinishFailed = options.onFinishFailed ?? vi.fn();
  const model = options.model ?? reactive({ username: '' });
  const rules = options.rules ?? { username: USERNAME_RULES };
  const formRef = { current: null as ComponentPublicInstance | null };
  const rest = { ...options };
  ['onFinish', 'onFinishFailed', 'model', 'rules'].forEach(key => delete rest[key]);

  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(
          Form,
          {
            model,
            name: 'test',
            onFinish,
            onFinishFailed,
            ref: (f: ComponentPublicInstance) => (formRef.current = f),
            ...rest,
          },
          () => [
            h(Form.Item, { label: '用户名', name: 'username', rules: rules.username }, () => [
              h(Input, { value: model.username, 'onUpdate:value': v => (model.username = v) }),
            ]),
            h('button', { type: 'submit' }, '提交'),
          ],
        ),
    }),
  );

  return { wrapper, model, onFinish, onFinishFailed, form: formRef.current as any };
}

const submit = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.find('form').trigger('submit');
};

describe('Form', () => {
  it('渲染表单骨架：前缀类名、layout 与 label', () => {
    const { wrapper } = makeForm();
    const form = wrapper.find('form');
    expect(form.classes()).toContain('xy-form');
    expect(form.classes()).toContain('xy-form-horizontal');
    expect(wrapper.find('label').text()).toBe('用户名');
    expect(wrapper.find('label').attributes('for')).toBe('test_username');
    wrapper.unmount();
  });

  it('带 required 规则的字段标签出现必填标记', () => {
    const { wrapper } = makeForm();
    expect(wrapper.find('label').classes()).toContain('xy-form-item-required');
    wrapper.unmount();
  });

  it('requiredMark=false 时表单带隐藏必填标记类（星号由该样式类隐藏）', () => {
    const { wrapper } = makeForm({ requiredMark: false });
    expect(wrapper.find('form').classes()).toContain('xy-form-hide-required-mark');
    wrapper.unmount();
  });

  it('提交空表单：不触发 finish，触发 finishFailed 并渲染错误态', async () => {
    const { wrapper, onFinish, onFinishFailed } = makeForm();
    await submit(wrapper);

    await vi.waitFor(() => expect(onFinishFailed).toHaveBeenCalledTimes(1));
    expect(onFinish).not.toHaveBeenCalled();
    expect(onFinishFailed.mock.calls[0][0].errorFields).toEqual([
      expect.objectContaining({ name: ['username'], errors: ['请输入用户名'] }),
    ]);
    expect(wrapper.find('.xy-form-item').classes()).toContain('xy-form-item-has-error');
    expect(wrapper.text()).toContain('请输入用户名');
    wrapper.unmount();
  });

  it('填好字段后提交：触发 finish 并带上表单值，错误态消失', async () => {
    const { wrapper, model, onFinish } = makeForm();
    model.username = 'xiaoye';
    await submit(wrapper);

    await vi.waitFor(() => expect(onFinish).toHaveBeenCalledWith({ username: 'xiaoye' }));
    expect(wrapper.find('.xy-form-item').classes()).not.toContain('xy-form-item-has-error');
    wrapper.unmount();
  });

  it('输入变化按 validateTrigger 自动校验，错误文案随之消失', async () => {
    const { wrapper } = makeForm();
    await submit(wrapper);
    await vi.waitFor(() => expect(wrapper.text()).toContain('请输入用户名'));

    await wrapper.find('input').setValue('有值了');
    await vi.waitFor(() => expect(wrapper.text()).not.toContain('请输入用户名'));
    expect(wrapper.find('input').element.value).toBe('有值了');
    wrapper.unmount();
  });

  it('失焦触发 blur 规则', async () => {
    const { wrapper } = makeForm({
      rules: {
        username: [{ pattern: /^[a-z]+$/, message: '只能用小写字母', trigger: 'blur' }],
      },
    });
    await wrapper.find('input').setValue('ABC');
    await wrapper.find('input').trigger('blur');

    await vi.waitFor(() => expect(wrapper.text()).toContain('只能用小写字母'));
    wrapper.unmount();
  });

  it('实例方法 validate / resetFields / clearValidate 对外可用', async () => {
    const { wrapper, model, onFinishFailed, form: api } = makeForm();

    await expect(api.validate()).rejects.toEqual(
      expect.objectContaining({
        errorFields: [expect.objectContaining({ errors: ['请输入用户名'] })],
      }),
    );
    await vi.waitFor(() =>
      expect(wrapper.find('.xy-form-item').classes()).toContain('xy-form-item-has-error'),
    );
    expect(onFinishFailed).not.toHaveBeenCalled();

    model.username = 'temp';
    api.resetFields();
    await vi.waitFor(() => expect(model.username).toBe(''));

    await api.validate().catch(() => null);
    await vi.waitFor(() =>
      expect(wrapper.find('.xy-form-item').classes()).toContain('xy-form-item-has-error'),
    );
    api.clearValidate();
    await vi.waitFor(() =>
      expect(wrapper.find('.xy-form-item').classes()).not.toContain('xy-form-item-has-error'),
    );
    wrapper.unmount();
  });

  it('getFieldsValue 返回当前字段值快照', async () => {
    const { wrapper, model, form } = makeForm();
    model.username = 'abc';
    await vi.waitFor(() => expect(form.getFieldsValue()).toEqual({ username: 'abc' }));
    wrapper.unmount();
  });

  it('嵌套 namePath 字段可以独立校验并显示错误', async () => {
    const model = reactive({ user: { name: '' } });
    let nestedForm: any;
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model, name: 'nested', ref: (f: any) => (nestedForm = f) }, () => [
            h(
              Form.Item,
              { name: ['user', 'name'], rules: [{ required: true, message: '请输入姓名' }] },
              () => [
                h(Input, {
                  value: model.user.name,
                  'onUpdate:value': v => (model.user.name = v),
                }),
              ],
            ),
          ]),
      }),
    );

    await expect(nestedForm.validate()).rejects.toBeTruthy();
    await vi.waitFor(() => expect(wrapper.text()).toContain('请输入姓名'));

    await wrapper.find('input').setValue('小野');
    await vi.waitFor(() => expect(wrapper.text()).not.toContain('请输入姓名'));
    expect(model.user.name).toBe('小野');
    wrapper.unmount();
  });
});
