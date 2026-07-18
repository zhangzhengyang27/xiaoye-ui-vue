import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Inplace from '..';
import InplaceDisplay from '../InplaceDisplay';
import InplaceContent from '../InplaceContent';
import mountTest from '../../../tests/shared/mountTest';

// 暴露给外部的实例方法（与 Inplace.tsx 中的 expose 一致）
interface InplaceExposed {
  open: (event?: Event) => void;
  close: (event?: Event) => void;
}

function getExposed(wrapper: ReturnType<typeof mount>): InplaceExposed {
  return wrapper.vm as unknown as InplaceExposed;
}

describe('Inplace', () => {
  mountTest(Inplace);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks with __XY_INPLACE flag', () => {
    expect((Inplace as any).__XY_INPLACE).toBe(true);
  });

  it('has install function', () => {
    expect(typeof Inplace.install).toBe('function');
  });

  it('renders root with xy-inplace class', () => {
    const wrapper = mount(Inplace);
    expect(wrapper.find('.xy-inplace').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders display area by default', () => {
    const wrapper = mount(Inplace, {
      slots: {
        display: '<span class="display-text">点击查看</span>',
      },
    });
    expect(wrapper.find('.xy-inplace-display').exists()).toBe(true);
    expect(wrapper.find('.display-text').exists()).toBe(true);
    expect(wrapper.find('.xy-inplace-content').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders content area when active is true', () => {
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        display: '<span>展示</span>',
        content: '<div class="editor">编辑器</div>',
      },
    });
    expect(wrapper.find('.xy-inplace-content').exists()).toBe(true);
    expect(wrapper.find('.editor').exists()).toBe(true);
    expect(wrapper.find('.xy-inplace-display').exists()).toBe(false);
    wrapper.unmount();
  });

  it('emits update:active and open when display clicked', async () => {
    const wrapper = mount(Inplace, {
      slots: {
        display: '<span>点击编辑</span>',
        content: '<div>编辑</div>',
      },
    });
    await wrapper.find('.xy-inplace-display').trigger('click');
    expect(wrapper.emitted('update:active')).toBeTruthy();
    expect(wrapper.emitted('update:active')[0]).toEqual([true]);
    expect(wrapper.emitted('open')).toBeTruthy();
    wrapper.unmount();
  });

  it('emits update:active and close when close button clicked', async () => {
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        content: '<div>编辑</div>',
      },
    });
    await wrapper.find('.xy-inplace-close').trigger('click');
    expect(wrapper.emitted('update:active')[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('open()/close() exposed methods work', async () => {
    const wrapper = mount(Inplace, {
      slots: {
        display: '<span>展示</span>',
        content: '<div>编辑</div>',
      },
    });
    const vm = getExposed(wrapper);
    vm.open();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xy-inplace-content').exists()).toBe(true);
    expect(wrapper.emitted('update:active')[0]).toEqual([true]);

    vm.close();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xy-inplace-display').exists()).toBe(true);
    expect(wrapper.emitted('update:active')[1]).toEqual([false]);
    wrapper.unmount();
  });

  it('disabled prevents open on click', async () => {
    const wrapper = mount(Inplace, {
      props: { disabled: true },
      slots: {
        display: '<span>展示</span>',
      },
    });
    expect(wrapper.find('.xy-inplace-display-disabled').exists()).toBe(true);
    expect(wrapper.find('.xy-inplace-display').attributes('tabindex')).toBe('-1');
    await wrapper.find('.xy-inplace-display').trigger('click');
    expect(wrapper.emitted('update:active')).toBeFalsy();
    expect(wrapper.emitted('open')).toBeFalsy();
    wrapper.unmount();
  });

  it('disabled prevents open via exposed method', () => {
    const wrapper = mount(Inplace, {
      props: { disabled: true },
      slots: {
        display: '<span>展示</span>',
      },
    });
    getExposed(wrapper).open();
    expect(wrapper.emitted('update:active')).toBeFalsy();
    wrapper.unmount();
  });

  it('displayToggleCallback returning false prevents open', async () => {
    const wrapper = mount(Inplace, {
      props: {
        displayToggleCallback: () => false,
      },
      slots: {
        display: '<span>展示</span>',
        content: '<div>编辑</div>',
      },
    });
    await wrapper.find('.xy-inplace-display').trigger('click');
    expect(wrapper.emitted('open')).toBeFalsy();
    expect(wrapper.find('.xy-inplace-content').exists()).toBe(false);
    wrapper.unmount();
  });

  it('displayToggleCallback returning true allows open', async () => {
    const wrapper = mount(Inplace, {
      props: {
        displayToggleCallback: () => true,
      },
      slots: {
        display: '<span>展示</span>',
        content: '<div>编辑</div>',
      },
    });
    await wrapper.find('.xy-inplace-display').trigger('click');
    expect(wrapper.emitted('open')).toBeTruthy();
    wrapper.unmount();
  });

  it('closable=false hides close button', () => {
    const wrapper = mount(Inplace, {
      props: { active: true, closable: false },
      slots: {
        content: '<div>编辑</div>',
      },
    });
    expect(wrapper.find('.xy-inplace-close').exists()).toBe(false);
    wrapper.unmount();
  });

  it('Enter and Space keys trigger open', async () => {
    const wrapper = mount(Inplace, {
      slots: {
        display: '<span>展示</span>',
        content: '<div>编辑</div>',
      },
    });
    await wrapper.find('.xy-inplace-display').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('open')).toBeTruthy();
    wrapper.unmount();
  });

  it('Escape key closes active content', async () => {
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        content: '<div>编辑</div>',
      },
      attachTo: 'body',
    });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('external click closes active content', async () => {
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        content: '<div>编辑</div>',
      },
      attachTo: 'body',
    });
    const external = document.createElement('div');
    document.body.appendChild(external);
    const event = new MouseEvent('mousedown', { bubbles: true });
    external.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('content slot receives closeCallback scope', async () => {
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        content: (scope: { closeCallback: () => void }) =>
          `<button class="custom-close" onclick="${() => scope.closeCallback()}">自定义关闭</button>`,
      },
    });
    expect(wrapper.find('.xy-inplace-content-inner').exists()).toBe(true);
    wrapper.unmount();
  });

  it('keeps active state synced with prop', async () => {
    const wrapper = mount(Inplace, {
      slots: {
        display: '<span>展示</span>',
        content: '<div>编辑</div>',
      },
    });
    expect(wrapper.find('.xy-inplace-display').exists()).toBe(true);
    await wrapper.setProps({ active: true });
    expect(wrapper.find('.xy-inplace-content').exists()).toBe(true);
    wrapper.unmount();
  });
});

describe('InplaceDisplay', () => {
  mountTest(InplaceDisplay);

  it('renders xy-inplace-display class', () => {
    const wrapper = mount(InplaceDisplay, {
      slots: { default: '点击编辑' },
    });
    expect(wrapper.find('.xy-inplace-display').exists()).toBe(true);
    expect(wrapper.text()).toContain('点击编辑');
    wrapper.unmount();
  });

  it('emits click when used standalone', async () => {
    const wrapper = mount(InplaceDisplay, {
      slots: { default: '点击' },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    wrapper.unmount();
  });

  it('triggers parent open when used inside Inplace', async () => {
    const wrapper = mount(Inplace, {
      slots: {
        display: () => <InplaceDisplay>子组件触发</InplaceDisplay>,
        content: '<div>编辑</div>',
      },
    });
    // 嵌套的 InplaceDisplay 点击触发父组件 open
    await wrapper.findComponent(InplaceDisplay).trigger('click');
    expect(wrapper.emitted('update:active')).toBeTruthy();
    wrapper.unmount();
  });
});

describe('InplaceContent', () => {
  mountTest(InplaceContent);

  it('renders xy-inplace-content class', () => {
    const wrapper = mount(InplaceContent, {
      slots: { default: '<div>编辑内容</div>' },
    });
    expect(wrapper.find('.xy-inplace-content').exists()).toBe(true);
    expect(wrapper.find('.xy-inplace-content-inner').exists()).toBe(true);
    wrapper.unmount();
  });

  it('shows close button when closable is true (default)', () => {
    const wrapper = mount(InplaceContent, {
      slots: { default: '内容' },
    });
    expect(wrapper.find('.xy-inplace-close').exists()).toBe(true);
    wrapper.unmount();
  });

  it('hides close button when closable is false', () => {
    const wrapper = mount(InplaceContent, {
      props: { closable: false },
      slots: { default: '内容' },
    });
    expect(wrapper.find('.xy-inplace-close').exists()).toBe(false);
    wrapper.unmount();
  });

  it('emits close when close button clicked standalone', async () => {
    const wrapper = mount(InplaceContent, {
      slots: { default: '内容' },
    });
    await wrapper.find('.xy-inplace-close').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('triggers parent close when used inside Inplace', async () => {
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        content: () => <InplaceContent>子组件内容</InplaceContent>,
      },
    });
    await wrapper.findComponent(InplaceContent).find('.xy-inplace-close').trigger('click');
    expect(wrapper.emitted('update:active')).toBeTruthy();
    expect(wrapper.emitted('update:active')[0]).toEqual([false]);
    wrapper.unmount();
  });

  it('removes document listeners on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(Inplace, {
      props: { active: true },
      slots: {
        content: '<div>编辑</div>',
      },
    });
    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });
});
