import { mount } from '@vue/test-utils';
import ScrollPanel from '../ScrollPanel';

describe('ScrollPanel', () => {
  it('should render correctly', () => {
    const wrapper = mount(ScrollPanel, {
      slots: {
        default: '<div style="height: 200px">content</div>',
      },
      attachTo: document.body,
    });
    expect(wrapper.find('.xy-scroll-panel').exists()).toBe(true);
    expect(wrapper.find('.xy-scroll-panel-content').exists()).toBe(true);
    expect(wrapper.find('.xy-scroll-panel-bar-x').exists()).toBe(true);
    expect(wrapper.find('.xy-scroll-panel-bar-y').exists()).toBe(true);
    wrapper.unmount();
  });

  it('should expose scrollTop method', async () => {
    const wrapper = mount(ScrollPanel, {
      slots: {
        default: '<div style="height: 200px">content</div>',
      },
      attachTo: document.body,
    });
    const contentEl = wrapper.find('.xy-scroll-panel-content').element;
    Object.defineProperty(contentEl, 'scrollHeight', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientHeight', { value: 100, configurable: true });
    await wrapper.vm.scrollTop(50);
    expect(contentEl.scrollTop).toBe(50);
    wrapper.unmount();
  });
});
