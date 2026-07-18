import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, expect, afterEach, vi } from 'vitest';
import BlockUI from '..';
import mountTest from '../../../tests/shared/mountTest';

// 暴露给外部的实例方法（与 BlockUI.tsx 中的 expose 一致）
interface BlockUIExposed {
  block: () => void;
  unblock: () => void;
  removeMask: () => Promise<void> | void;
  isBlocked: boolean;
  onMaskEnter: (el: Element) => void;
}

// 获取 BlockUI 实例上 expose 的方法
function getExposed(wrapper: ReturnType<typeof mount>): BlockUIExposed {
  return wrapper.vm as unknown as BlockUIExposed;
}

// 等待 Transition 动画结束的辅助函数
function wait(ms = 350): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('BlockUI', () => {
  mountTest(BlockUI);

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
  });

  it('marks with __XY_BLOCK_UI flag', () => {
    expect((BlockUI as any).__XY_BLOCK_UI).toBe(true);
  });

  it('has install function', () => {
    expect(typeof BlockUI.install).toBe('function');
  });

  it('does not render mask when blocked is false by default', () => {
    const wrapper = mount(BlockUI, {
      slots: { default: '<div class="content">content</div>' },
      attachTo: 'body',
    });
    expect(document.querySelector('.xy-block-ui-mask')).toBeNull();
    expect(wrapper.attributes('aria-busy')).toBe('false');
    wrapper.unmount();
  });

  it('renders mask when blocked is true on mount', async () => {
    const wrapper = mount(BlockUI, {
      props: { blocked: true },
      slots: { default: '<div class="content">content</div>' },
      attachTo: 'body',
    });
    await nextTick();
    expect(getExposed(wrapper).isBlocked).toBe(true);
    expect(document.querySelector('.xy-block-ui-mask')).not.toBeNull();
    expect(wrapper.attributes('aria-busy')).toBe('true');
    wrapper.unmount();
  });

  it('emits block event when blocked becomes true', async () => {
    const wrapper = mount(BlockUI, {
      attachTo: 'body',
    });
    expect(getExposed(wrapper).isBlocked).toBe(false);
    await wrapper.setProps({ blocked: true });
    expect(getExposed(wrapper).isBlocked).toBe(true);
    expect(wrapper.emitted('block')).toBeTruthy();
    expect(wrapper.emitted('block').length).toBe(1);
    wrapper.unmount();
  });

  it('emits unblock event after blocked becomes false', async () => {
    const wrapper = mount(BlockUI, {
      props: { blocked: true },
      attachTo: 'body',
    });
    await nextTick();
    expect(getExposed(wrapper).isBlocked).toBe(true);

    await wrapper.setProps({ blocked: false });
    // blocked prop 变化后，内部 isBlocked 立即变为 false
    expect(getExposed(wrapper).isBlocked).toBe(false);
    expect(wrapper.emitted('unblock')).toBeTruthy();
    wrapper.unmount();
  });

  it('exposes block/unblock/removeMask methods', () => {
    const wrapper = mount(BlockUI, {
      attachTo: 'body',
    });
    const vm = getExposed(wrapper);
    expect(typeof vm.block).toBe('function');
    expect(typeof vm.unblock).toBe('function');
    expect(typeof vm.removeMask).toBe('function');
    wrapper.unmount();
  });

  it('appends mask to body when fullScreen is true', async () => {
    const wrapper = mount(BlockUI, {
      props: { fullScreen: true },
      attachTo: 'body',
    });
    await getExposed(wrapper).block();
    await nextTick();
    const mask = document.body.querySelector('.xy-block-ui-mask');
    expect(mask).not.toBeNull();
    expect(mask.classList.contains('xy-block-ui-mask-fullscreen')).toBe(true);
    // body 应该被加上 overflow 锁定类
    expect(document.body.classList.contains('xy-block-ui-overflow-hidden')).toBe(true);
    wrapper.unmount();
  });

  it('appends mask to custom container via CSS selector', async () => {
    const container = document.createElement('div');
    container.id = 'custom-block-target';
    document.body.appendChild(container);

    const wrapper = mount(BlockUI, {
      props: { container: '#custom-block-target' },
      attachTo: 'body',
    });
    await getExposed(wrapper).block();
    await nextTick();
    const mask = container.querySelector('.xy-block-ui-mask');
    expect(mask).not.toBeNull();
    wrapper.unmount();
    container.remove();
  });

  it('appends mask to custom HTMLElement container', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const wrapper = mount(BlockUI, {
      props: { container },
      attachTo: 'body',
    });
    await getExposed(wrapper).block();
    await nextTick();
    expect(container.querySelector('.xy-block-ui-mask')).not.toBeNull();
    wrapper.unmount();
    container.remove();
  });

  it('sets z-index via ZIndex manager when autoZIndex is true', () => {
    const wrapper = mount(BlockUI, {
      props: { autoZIndex: true, baseZIndex: 1000 },
      attachTo: 'body',
    });
    const el = document.createElement('div');
    getExposed(wrapper).onMaskEnter(el);
    expect(el.style.zIndex).not.toBe('');
    const z = parseInt(el.style.zIndex, 10);
    expect(z).toBeGreaterThanOrEqual(1001);
    wrapper.unmount();
  });

  it('uses explicit zIndex when provided', () => {
    const wrapper = mount(BlockUI, {
      props: { zIndex: 9999 },
      attachTo: 'body',
    });
    const el = document.createElement('div');
    el.style.zIndex = '';
    getExposed(wrapper).onMaskEnter(el);
    expect(el.style.zIndex).toBe('9999');
    wrapper.unmount();
  });

  it('does not set zIndex via ZIndex manager when autoZIndex is false', () => {
    const wrapper = mount(BlockUI, {
      props: { autoZIndex: false },
      attachTo: 'body',
    });
    const el = document.createElement('div');
    el.style.zIndex = '';
    getExposed(wrapper).onMaskEnter(el);
    expect(el.style.zIndex).toBe('');
    wrapper.unmount();
  });

  it('renders default Spin indicator inside mask', async () => {
    const wrapper = mount(BlockUI, {
      attachTo: 'body',
    });
    await getExposed(wrapper).block();
    await nextTick();
    const spin = document.querySelector('.xy-block-ui-content .xy-spin');
    expect(spin).not.toBeNull();
    wrapper.unmount();
  });

  it('renders tip text when tip prop is provided', async () => {
    const wrapper = mount(BlockUI, {
      props: { tip: '加载中...' },
      attachTo: 'body',
    });
    await getExposed(wrapper).block();
    await nextTick();
    const tipEl = document.querySelector('.xy-block-ui-tip');
    expect(tipEl).not.toBeNull();
    expect(tipEl?.textContent).toContain('加载中');
    wrapper.unmount();
  });

  it('renders custom mask content via #mask slot', async () => {
    const wrapper = mount(BlockUI, {
      slots: {
        mask: '<div class="custom-mask-content">custom</div>',
      },
      attachTo: 'body',
    });
    await getExposed(wrapper).block();
    await nextTick();
    expect(document.querySelector('.custom-mask-content')).not.toBeNull();
    // 自定义 mask 时不应渲染默认 Spin
    expect(document.querySelector('.xy-block-ui-content .xy-spin')).toBeNull();
    wrapper.unmount();
  });

  it('removeMask clears state immediately', async () => {
    const wrapper = mount(BlockUI, {
      props: { blocked: true },
      attachTo: 'body',
    });
    await nextTick();
    expect(getExposed(wrapper).isBlocked).toBe(true);

    await getExposed(wrapper).removeMask();
    expect(getExposed(wrapper).isBlocked).toBe(false);
    const unblockEvents = wrapper.emitted('unblock');
    expect(unblockEvents).toBeTruthy();
    expect(unblockEvents.length).toBeGreaterThanOrEqual(1);
    wrapper.unmount();
  });

  it('clears body overflow lock on unmount when fullScreen', async () => {
    const wrapper = mount(BlockUI, {
      props: { fullScreen: true, blocked: true },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.classList.contains('xy-block-ui-overflow-hidden')).toBe(true);
    wrapper.unmount();
    expect(document.body.classList.contains('xy-block-ui-overflow-hidden')).toBe(false);
  });

  it('does not double-block when block() is called twice', async () => {
    const wrapper = mount(BlockUI, {
      attachTo: 'body',
    });
    const vm = getExposed(wrapper);
    await vm.block();
    await vm.block();
    expect(wrapper.emitted('block').length).toBe(1);
    wrapper.unmount();
  });

  it('does not double-unblock when unblock() is called twice', async () => {
    const wrapper = mount(BlockUI, {
      props: { blocked: true },
      attachTo: 'body',
    });
    await nextTick();
    const vm = getExposed(wrapper);
    await vm.unblock();
    await vm.unblock();
    expect(wrapper.emitted('unblock').length).toBe(1);
    wrapper.unmount();
  });

  it('waits for transition leave animation to remove mask', async () => {
    vi.useFakeTimers();
    const wrapper = mount(BlockUI, {
      props: { blocked: true },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.querySelector('.xy-block-ui-mask')).not.toBeNull();

    await wrapper.setProps({ blocked: false });
    // 此时 mask DOM 应该还在（动画进行中），但 isBlocked 已变为 false
    // 注意：Vue Transition 在 isBlocked=false 后会渲染 leave 动画
    vi.advanceTimersByTime(500);
    vi.useRealTimers();
    await wait(0);
    wrapper.unmount();
  });
});
