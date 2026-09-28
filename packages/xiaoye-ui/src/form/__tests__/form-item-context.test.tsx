import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { defineComponent, h, nextTick, reactive } from 'vue';
import Form from '../index';
import Input from '../../input';

const flush = async () => {
  await nextTick();
  await Promise.resolve();
  await nextTick();
};

/** 会向所属 FormItem 注册自己并读取上下文的自定义控件 */
const ContextProbe = defineComponent({
  name: 'ContextProbe',
  setup() {
    const itemContext = Form.useInjectFormItemContext();
    return () => h('span', { class: 'probe' }, String(itemContext.id.value));
  },
});

function mountWithItem(children: () => any[]) {
  const model = reactive({ username: '' });
  return mount(
    defineComponent({
      setup: () => () =>
        h(Form, { model, name: 'test' }, () => [
          h(Form.Item, { label: '用户名', name: 'username' }, children),
        ]),
    }),
  );
}

const captureDevLogs = () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  return {
    text: () => [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().join(' '),
    restore: () => {
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    },
  };
};

describe('Form.ItemRest 与 form item 上下文', () => {
  it('Item 内的控件拿到关联到的字段 id', () => {
    const wrapper = mountWithItem(() => [h(ContextProbe)]);
    expect(wrapper.find('.probe').text()).toBe('test_username');
    wrapper.unmount();
  });

  it('包进 Form.ItemRest 的控件不再被收集，回落到空上下文', () => {
    const wrapper = mountWithItem(() => [
      h(Form.ItemRest, null, () => [h(ContextProbe, { class: 'inside-rest' })]),
    ]);
    // 默认上下文的 id 是 undefined
    expect(wrapper.find('.probe').text()).toBe('undefined');
    wrapper.unmount();
  });

  it('同一个 Item 里收集到两个控件时给出开发告警', async () => {
    const logs = captureDevLogs();
    const wrapper = mountWithItem(() => [
      h(ContextProbe, { class: 'first' }),
      h(ContextProbe, { class: 'second' }),
    ]);

    await vi.waitFor(() =>
      expect(logs.text()).toContain('FormItem can only collect one field item'),
    );
    // 提示里的标签名必须是本项目前缀，不能把用户指向不存在的 a-* 标签
    expect(logs.text()).toContain('xy-form-item-rest');
    logs.restore();
    wrapper.unmount();
  });

  it('ItemRest 里的控件不计入收集数量，因此不触发告警', async () => {
    const logs = captureDevLogs();
    const wrapper = mountWithItem(() => [
      h(ContextProbe, { class: 'collected' }),
      h(Form.ItemRest, null, () => [h(ContextProbe, { class: 'ignored' })]),
    ]);
    await flush();
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(logs.text()).not.toContain('FormItem can only collect one field item');
    logs.restore();
    wrapper.unmount();
  });

  it('脱离 Form.Item 使用 useInjectFormItemContext 时返回可用的空上下文', () => {
    const probe = defineComponent({
      setup() {
        const itemContext = Form.useInjectFormItemContext();
        return () =>
          h(
            'div',
            { class: 'standalone' },
            `${itemContext.id.value}|${typeof itemContext.onFieldBlur}`,
          );
      },
    });
    const wrapper = mount(probe);
    expect(wrapper.find('.standalone').text()).toBe('undefined|function');
    wrapper.unmount();
  });
});

describe('Form.Item 错误列表渲染', () => {
  function mountValidated(rules: any[]) {
    const model = reactive({ username: 'AB' });
    let api: any;
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model, name: 'test', ref: (f: any) => (api = f) }, () => [
            h(Form.Item, { label: '用户名', name: 'username', rules }, () => [h(Input)]),
          ]),
      }),
    );
    return { wrapper, api, model };
  }

  it('多条规则同时失败时全部列出', async () => {
    const { wrapper, api } = mountValidated([
      { pattern: /^[a-z]+$/, message: '只能小写' },
      { max: 1, message: '最长 1 个字符' },
    ]);

    await api.validate().catch(() => null);
    await vi.waitFor(() => expect(wrapper.text()).toContain('只能小写'));
    expect(wrapper.text()).toContain('最长 1 个字符');
    wrapper.unmount();
  });

  it('校验通过时不渲染错误列表', async () => {
    const { wrapper, api, model } = mountValidated([{ pattern: /^[a-z]+$/, message: '只能小写' }]);

    await api.validate().catch(() => null);
    await vi.waitFor(() => expect(wrapper.text()).toContain('只能小写'));

    model.username = 'ab';
    await api.validate().catch(() => null);
    await vi.waitFor(() => expect(wrapper.text()).not.toContain('只能小写'));
    wrapper.unmount();
  });

  it('显式 help 覆盖校验错误文案', async () => {
    const model = reactive({ username: '' });
    let api: any;
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model, name: 'test', ref: (f: any) => (api = f) }, () => [
            h(
              Form.Item,
              {
                label: '用户名',
                name: 'username',
                help: '这是固定提示',
                rules: [{ required: true, message: '请输入用户名' }],
              },
              () => [h(Input)],
            ),
          ]),
      }),
    );

    await api.validate().catch(() => null);
    await vi.waitFor(() => expect(wrapper.text()).toContain('这是固定提示'));
    expect(wrapper.text()).not.toContain('请输入用户名');
    wrapper.unmount();
  });

  it('hidden 的字段仍注册但从视觉上隐藏', () => {
    const { wrapper } = mountValidated([{ required: true, message: '请输入用户名' }]);
    const hidden = mount(
      defineComponent({
        setup: () => () =>
          h(Form, { model: reactive({ username: '' }), name: 'test' }, () => [
            h(Form.Item, { name: 'username', hidden: true }, () => [h(Input)]),
          ]),
      }),
    );
    expect(hidden.find('.xy-form-item-hidden').exists()).toBe(true);
    expect(wrapper.find('.xy-form-item-hidden').exists()).toBe(false);
    hidden.unmount();
    wrapper.unmount();
  });
});
