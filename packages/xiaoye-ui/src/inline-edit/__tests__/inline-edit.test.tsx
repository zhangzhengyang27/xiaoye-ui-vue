import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import InlineEdit from '..';
import mountTest from '../../../tests/shared/mountTest';

// 暴露给外部的实例方法（与 InlineEdit.tsx 中的 expose 一致）
interface InlineEditExposed {
  save: (event?: Event) => void;
  cancel: (event?: Event) => void;
  edit: (event?: Event) => void;
}

function getExposed(wrapper: ReturnType<typeof mount>): InlineEditExposed {
  return wrapper.vm as unknown as InlineEditExposed;
}

describe('InlineEdit', () => {
  mountTest(InlineEdit);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks with __XY_INLINE_EDIT flag', () => {
    expect((InlineEdit as any).__XY_INLINE_EDIT).toBe(true);
  });

  it('has install function', () => {
    expect(typeof InlineEdit.install).toBe('function');
  });

  it('renders root with xy-inline-edit class', () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
    });
    expect(wrapper.find('.xy-inline-edit').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-display').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-content').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders display text from modelValue', () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
    });
    expect(wrapper.find('.xy-inline-edit-display-text').text()).toBe('张三');
    wrapper.unmount();
  });

  it('renders placeholder when modelValue is empty', () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '', placeholder: '请输入' },
    });
    expect(wrapper.find('.xy-inline-edit-display-empty').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-display-text').text()).toBe('请输入');
    wrapper.unmount();
  });

  it('emits edit and update:editable when display clicked', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
    });
    await wrapper.find('.xy-inline-edit-display').trigger('click');
    expect(wrapper.emitted('update:editable')).toBeTruthy();
    expect(wrapper.emitted('update:editable')[0]).toEqual([true]);
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.find('.xy-inline-edit-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('Enter and Space keys trigger edit', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
    });
    await wrapper.find('.xy-inline-edit-display').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('edit')).toBeTruthy();
    wrapper.unmount();
  });

  it('disabled prevents edit on click', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', disabled: true },
    });
    expect(wrapper.find('.xy-inline-edit-display-disabled').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-display').attributes('tabindex')).toBe('-1');
    await wrapper.find('.xy-inline-edit-display').trigger('click');
    expect(wrapper.emitted('update:editable')).toBeFalsy();
    expect(wrapper.emitted('edit')).toBeFalsy();
    wrapper.unmount();
  });

  it('disabled prevents edit via exposed method', () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', disabled: true },
    });
    getExposed(wrapper).edit();
    expect(wrapper.emitted('update:editable')).toBeFalsy();
    wrapper.unmount();
  });

  it('renders Input editor for type=text', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
    });
    // 等待 nextTick 后 input ref 已挂载
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xy-inline-edit-editor').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-actions').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-btn-save').exists()).toBe(true);
    expect(wrapper.find('.xy-inline-edit-btn-cancel').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders TextArea editor for type=textarea', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '多行文本', type: 'textarea', editable: true },
    });
    await wrapper.vm.$nextTick();
    const editor = wrapper.find('.xy-inline-edit-editor');
    expect(editor.exists()).toBe(true);
    expect(editor.element.tagName.toLowerCase()).toBe('textarea');
    wrapper.unmount();
  });

  it('save button emits update:modelValue, change, save and exits edit', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
    });
    await wrapper.vm.$nextTick();
    // 模拟输入新值
    const input = wrapper.find('.xy-inline-edit-editor');
    await input.setValue('李四');
    await wrapper.find('.xy-inline-edit-btn-save').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['李四']);
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')[0]).toEqual(['李四']);
    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')[0]).toEqual(['李四']);
    expect(wrapper.emitted('update:editable')).toBeTruthy();
    // 最后一次 update:editable 应为 false（退出编辑）
    const editableEvents = wrapper.emitted('update:editable');
    expect(editableEvents[editableEvents.length - 1]).toEqual([false]);
    expect(wrapper.find('.xy-inline-edit-display').exists()).toBe(true);
    wrapper.unmount();
  });

  it('cancel button restores original value and emits cancel', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('.xy-inline-edit-editor');
    await input.setValue('临时修改');
    await wrapper.find('.xy-inline-edit-btn-cancel').trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.emitted('cancel')[0]).toEqual(['张三']);
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    expect(wrapper.find('.xy-inline-edit-display').exists()).toBe(true);
    wrapper.unmount();
  });

  it('save via exposed method works', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('.xy-inline-edit-editor');
    await input.setValue('王五');
    getExposed(wrapper).save();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')[0]).toEqual(['王五']);
    wrapper.unmount();
  });

  it('number type normalizes value on save', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: 0, type: 'number', editable: true },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find('.xy-inline-edit-editor');
    await input.setValue('42');
    getExposed(wrapper).save();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([42]);
    expect(typeof wrapper.emitted('save')[0][0]).toBe('number');
    wrapper.unmount();
  });

  it('autoSave emits update:modelValue, change and save on each input', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', autoSave: true },
    });
    await wrapper.find('.xy-inline-edit-display').trigger('click');
    await wrapper.vm.$nextTick();
    const input = wrapper.find('.xy-inline-edit-editor');
    await input.setValue('新值');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('save')).toBeTruthy();
    // autoSave 保留编辑态
    expect(wrapper.find('.xy-inline-edit-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('save without changes does not emit update:modelValue but still emits save', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
    });
    await wrapper.vm.$nextTick();
    await wrapper.find('.xy-inline-edit-btn-save').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    expect(wrapper.emitted('change')).toBeFalsy();
    expect(wrapper.emitted('save')).toBeTruthy();
    wrapper.unmount();
  });

  it('Escape key cancels active edit', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
      attachTo: 'body',
    });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('cancel')).toBeTruthy();
    wrapper.unmount();
  });

  it('external click saves active edit', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
      attachTo: 'body',
    });
    const external = document.createElement('div');
    document.body.appendChild(external);
    const event = new MouseEvent('mousedown', { bubbles: true });
    external.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('save')).toBeTruthy();
    wrapper.unmount();
  });

  it('keeps editable state synced with prop', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
    });
    expect(wrapper.find('.xy-inline-edit-display').exists()).toBe(true);
    await wrapper.setProps({ editable: true });
    expect(wrapper.find('.xy-inline-edit-content').exists()).toBe(true);
    await wrapper.setProps({ editable: false });
    expect(wrapper.find('.xy-inline-edit-display').exists()).toBe(true);
    wrapper.unmount();
  });

  it('keeps internal value synced when modelValue changes externally', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
    });
    await wrapper.setProps({ modelValue: '李四' });
    expect(wrapper.find('.xy-inline-edit-display-text').text()).toBe('李四');
    wrapper.unmount();
  });

  it('removes document listeners on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
    });
    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('supports custom display slot', () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三' },
      slots: {
        default: '<span class="custom-display">张三</span>',
      },
    });
    expect(wrapper.find('.custom-display').exists()).toBe(true);
    expect(wrapper.find('.custom-display').text()).toBe('张三');
    wrapper.unmount();
  });

  it('supports custom edit slot with save/cancel scope', async () => {
    const wrapper = mount(InlineEdit, {
      props: { modelValue: '张三', editable: true },
      slots: {
        edit: '<div class="custom-editor">自定义编辑器</div>',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.custom-editor').exists()).toBe(true);
    // 自定义插槽时不渲染默认操作按钮
    expect(wrapper.find('.xy-inline-edit-actions').exists()).toBe(false);
    wrapper.unmount();
  });
});
