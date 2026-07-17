import { mount } from '@vue/test-utils';
import Editor from '.';
import mountTest from '../../tests/shared/mountTest';

// mock quill 的动态 import，避免 jsdom 下初始化失败
vi.mock('quill', () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    off: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    hasFocus: vi.fn(() => false),
    clipboard: { convert: vi.fn(() => ({})) },
    setContents: vi.fn(),
    setText: vi.fn(),
    getText: vi.fn(() => ''),
    getSemanticHTML: vi.fn(() => '<p></p>'),
    getModule: vi.fn(() => ({})),
    destroy: vi.fn(),
  })),
}));

// mock quill 主题 CSS 的动态 import，避免 jsdom 下解析 CSS 失败
vi.mock('quill/dist/quill.snow.css', () => ({}));

describe('Editor', () => {
  mountTest(Editor);

  it('has correct name and flag', () => {
    expect(Editor.name).toBe('XYEditor');
    expect(Editor.__XY_EDITOR).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof Editor.install).toBe('function');
  });

  it('renders root element with xy-editor class', () => {
    const wrapper = mount(Editor);
    expect(wrapper.find('.xy-editor').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders toolbar and content containers', () => {
    const wrapper = mount(Editor);
    expect(wrapper.find('.xy-editor-toolbar').exists()).toBe(true);
    expect(wrapper.find('.xy-editor-content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders default toolbar buttons', () => {
    const wrapper = mount(Editor);
    expect(wrapper.find('.ql-bold').exists()).toBe(true);
    expect(wrapper.find('.ql-italic').exists()).toBe(true);
    expect(wrapper.find('.ql-underline').exists()).toBe(true);
    expect(wrapper.find('.ql-link').exists()).toBe(true);
    expect(wrapper.find('.ql-clean').exists()).toBe(true);
    wrapper.unmount();
  });

  it('applies invalid class when invalid prop is true', () => {
    const wrapper = mount(Editor, { props: { invalid: true } });
    expect(wrapper.find('.xy-editor-invalid').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders custom toolbar slot', () => {
    const wrapper = mount(Editor, {
      slots: {
        toolbar: '<div class="custom-toolbar">Custom</div>',
      },
    });
    expect(wrapper.find('.custom-toolbar').exists()).toBe(true);
    expect(wrapper.find('.ql-bold').exists()).toBe(false);
    wrapper.unmount();
  });

  it('applies editorStyle to content', () => {
    const wrapper = mount(Editor, {
      props: { editorStyle: { height: '300px' } },
    });
    const content = wrapper.find('.xy-editor-content');
    expect(content.attributes('style')).toContain('height: 300px');
    wrapper.unmount();
  });
});
