import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import BackTop from '../BackTop';

describe('BackTop', () => {
  beforeEach(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // 等待 throttleByAnimationFrame 触发（基于 requestAnimationFrame）
  const flushRaf = async () => {
    await new Promise(resolve => requestAnimationFrame(resolve));
    await nextTick();
  };

  it('renders with default props', () => {
    const wrapper = mount(BackTop);
    expect(wrapper.find('.xy-back-top').exists()).toBe(true);
    wrapper.unmount();
  });

  it('is not visible when scroll is below visibilityHeight', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 400 },
    });
    expect(wrapper.find('.xy-back-top').classes()).not.toContain('xy-back-top-visible');
    wrapper.unmount();
  });

  it('is visible by default when visibilityHeight is 0', async () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
    });
    await flushRaf();
    expect(wrapper.find('.xy-back-top').classes()).toContain('xy-back-top-visible');
    wrapper.unmount();
  });

  it('becomes visible after scrolling past visibilityHeight', async () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 400 },
    });
    await flushRaf();
    // 默认监听 document 滚动，设置 documentElement.scrollTop 模拟页面滚动
    document.documentElement.scrollTop = 500;
    document.dispatchEvent(new Event('scroll'));
    await flushRaf();
    expect(wrapper.find('.xy-back-top').classes()).toContain('xy-back-top-visible');
    wrapper.unmount();
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0, duration: 0 },
    });
    await flushRaf();
    await wrapper.find('.xy-back-top').trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    wrapper.unmount();
  });

  it('renders custom slot content', () => {
    const wrapper = mount(BackTop, {
      slots: {
        default: '回到顶部',
      },
    });
    expect(wrapper.text()).toContain('回到顶部');
    wrapper.unmount();
  });

  it('becomes visible when target container scrolls past visibilityHeight', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const wrapper = mount(BackTop, {
      props: {
        target: () => container,
        visibilityHeight: 100,
      },
    });

    await nextTick();
    await flushRaf();

    container.scrollTop = 200;
    container.dispatchEvent(new Event('scroll'));
    await flushRaf();

    expect(wrapper.find('.xy-back-top').classes()).toContain('xy-back-top-visible');

    wrapper.unmount();
    document.body.removeChild(container);
  });

  it('rebinds scroll event when target changes', async () => {
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    document.body.appendChild(container1);
    document.body.appendChild(container2);

    const wrapper = mount(BackTop, {
      props: {
        target: () => container1,
        visibilityHeight: 100,
      },
    });

    await nextTick();
    await flushRaf();

    container2.scrollTop = 300;
    wrapper.setProps({ target: () => container2 });
    await nextTick();
    await flushRaf();

    container2.dispatchEvent(new Event('scroll'));
    await flushRaf();

    expect(wrapper.find('.xy-back-top').classes()).toContain('xy-back-top-visible');

    wrapper.unmount();
    document.body.removeChild(container1);
    document.body.removeChild(container2);
  });
});
