import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import MarkdownEditor from '../MarkdownEditor';

// mock Vditor 模块，避免 jsdom 下初始化真实编辑器
const mockVditorInstance = {
  getValue: vi.fn(() => '# mock markdown'),
  getHTML: vi.fn(() => '<h1>mock html</h1>'),
  setValue: vi.fn(),
  insertValue: vi.fn(),
  insertMD: vi.fn(),
  disabled: vi.fn(),
  enable: vi.fn(),
  setTheme: vi.fn(),
  focus: vi.fn(),
  blur: vi.fn(),
  getSelection: vi.fn(() => 'selection'),
  clearStack: vi.fn(),
  tip: vi.fn(),
  html2md: vi.fn(() => '# converted'),
  destroy: vi.fn(),
};

const MockVditor = vi.fn(function (element, options) {
  Object.assign(this, mockVditorInstance);
  this.element = element;
  this.options = options;
  // 模拟异步渲染完成回调
  if (options && typeof options.after === 'function') {
    setTimeout(() => options.after(), 0);
  }
});

vi.mock('vditor', () => ({
  default: MockVditor,
}));

vi.mock('vditor/dist/index.css', () => ({}));

describe('MarkdownEditor', () => {
  it('应该正确渲染组件 name 与标签类名', () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' },
    });
    expect(wrapper.vm.$options.name).toBe('XYMarkdownEditor');
    // 容器应包含组件根元素
    expect(wrapper.find('.xy-markdown-editor').exists()).toBe(true);
    wrapper.unmount();
  });

  it('应该具有 __XY_MARKDOWN_EDITOR 内部标识', () => {
    expect(MarkdownEditor.__XY_MARKDOWN_EDITOR).toBe(true);
  });

  it('应该在 onMounted 时动态加载 Vditor 并初始化', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '# hello' },
    });
    await nextTick();
    // 等待动态 import 完成
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(MockVditor).toHaveBeenCalled();
    const callArgs = MockVditor.mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(HTMLElement);
    expect(callArgs[1].value).toBe('# hello');
    expect(callArgs[1].mode).toBe('ir');
    wrapper.unmount();
  });

  it('默认 valueFormat 应为 markdown，input 回调应触发 update:modelValue', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    const options = MockVditor.mock.calls[MockVditor.mock.calls.length - 1][1];
    // 触发 input 回调
    options.input('新内容');
    // 默认 valueFormat='markdown'，应通过 getValue 取值
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('input')).toBeTruthy();
    wrapper.unmount();
  });

  it('valueFormat=html 时，update:modelValue 应通过 getHTML 取值', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '', valueFormat: 'html' },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    const options = MockVditor.mock.calls[MockVditor.mock.calls.length - 1][1];
    mockVditorInstance.getHTML.mockReturnValue('<p>html content</p>');
    options.input('# md');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('<p>html content</p>');
    wrapper.unmount();
  });

  it('readonly=true 时，after 回调应调用 disabled', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '', readonly: true },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockVditorInstance.disabled).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('监听 readonly 变化应切换 disabled/enable', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '', readonly: false },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    mockVditorInstance.disabled.mockClear();
    mockVditorInstance.enable.mockClear();

    await wrapper.setProps({ readonly: true });
    expect(mockVditorInstance.disabled).toHaveBeenCalled();

    await wrapper.setProps({ readonly: false });
    expect(mockVditorInstance.enable).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('modelValue 变化应同步到 Vditor', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    mockVditorInstance.setValue.mockClear();
    mockVditorInstance.getValue.mockReturnValue('old value');

    await wrapper.setProps({ modelValue: 'new value' });
    expect(mockVditorInstance.setValue).toHaveBeenCalledWith('new value', true);
    wrapper.unmount();
  });

  it('应该在卸载时调用 destroy', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    mockVditorInstance.destroy.mockClear();
    wrapper.unmount();
    expect(mockVditorInstance.destroy).toHaveBeenCalled();
  });

  it('应该通过 expose 暴露 Vditor 实例方法', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    const vm = wrapper.vm;
    expect(typeof vm.getVditor).toBe('function');
    expect(typeof vm.getValue).toBe('function');
    expect(typeof vm.getHTML).toBe('function');
    expect(typeof vm.setValue).toBe('function');
    expect(typeof vm.insertValue).toBe('function');
    expect(typeof vm.disabled).toBe('function');
    expect(typeof vm.enable).toBe('function');
    expect(typeof vm.focus).toBe('function');
    expect(typeof vm.blur).toBe('function');

    vm.getValue();
    expect(mockVditorInstance.getValue).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('应该支持通过 options prop 透传完整 Vditor options', async () => {
    const customAfter = vi.fn();
    mount(MarkdownEditor, {
      props: {
        modelValue: '',
        options: { after: customAfter, height: 500 },
      },
    });
    await new Promise(resolve => setTimeout(resolve, 10));

    const callArgs = MockVditor.mock.calls[MockVditor.mock.calls.length - 1];
    // options 透传应覆盖默认值
    expect(callArgs[1].height).toBe(500);
    expect(callArgs[1].after).toBe(customAfter);
  });
});
