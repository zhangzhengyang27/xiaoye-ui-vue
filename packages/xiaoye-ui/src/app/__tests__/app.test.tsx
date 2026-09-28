import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import App from '../index';
import { useInjectAppContext } from '../context';

const Child = defineComponent({
  name: 'AppConsumer',
  setup() {
    const context = useInjectAppContext();
    return () => h('div', { id: 'consumer' }, JSON.stringify(Object.keys(context)));
  },
});

describe('App', () => {
  it('渲染 .xy-app 包裹节点，并把默认插槽内容放在 holder 之后', () => {
    const wrapper = mount(App, {
      slots: { default: () => h('p', { class: 'inner-content' }, '内容') },
    });
    const root = wrapper.find('div.xy-app');
    expect(root.exists()).toBe(true);
    expect(wrapper.find('.inner-content').exists()).toBe(true);
    // 未调用任何静态 API 时不应产生 message/notification/modal 容器
    expect(document.querySelector('.xy-message')).toBeNull();
    wrapper.unmount();
  });

  it('rootClassName 追加到包裹节点', () => {
    const wrapper = mount(App, { props: { rootClassName: 'my-root' } });
    expect(wrapper.find('div.my-root.xy-app').exists()).toBe(true);
    wrapper.unmount();
  });

  it('App.useApp 暴露 message / notification / modal 三套上下文 API', () => {
    const wrapper = mount(App, { slots: { default: () => h(Child) } });
    expect(wrapper.find('#consumer').text()).toBe('["message","notification","modal"]');
    wrapper.unmount();
  });

  it('脱离 App 使用时 useApp 返回可用的默认上下文（不抛错）', () => {
    const probe = defineComponent({
      setup() {
        const app = App.useApp();
        return () => h('div', { id: 'probe' }, typeof app.message?.success);
      },
    });
    const wrapper = mount(probe);
    expect(wrapper.find('#probe').text()).toBe('undefined');
    wrapper.unmount();
  });

  it('注册为全局组件时使用 xy-app 标签名', () => {
    const wrapper = mount(App, { props: { class: 'extra' } });
    expect(wrapper.find('div.xy-app.extra').exists()).toBe(true);
    wrapper.unmount();
  });
});
