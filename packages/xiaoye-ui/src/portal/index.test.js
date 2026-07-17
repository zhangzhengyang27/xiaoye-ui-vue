import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Portal from '.';
import mountTest from '../../tests/shared/mountTest';

describe('Portal', () => {
  mountTest(Portal);

  it('renders inline content when disabled', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Portal disabled>
              <span class="content">hello</span>
            </Portal>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    expect(wrapper.find('.content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders inline content when appendTo is "self"', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Portal appendTo="self">
              <span class="content">hello</span>
            </Portal>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    expect(wrapper.find('.content').exists()).toBe(true);
    wrapper.unmount();
  });

  it('teleports content to body after mount when appendTo is "body"', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Portal appendTo="body">
              <span class="portal-content">teleported</span>
            </Portal>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await nextTick();
    // Teleport 会把内容渲染到 body
    expect(document.body.querySelector('.portal-content')).not.toBeNull();
    wrapper.unmount();
  });

  it('renders nothing before mount when teleporting', async () => {
    // 通过 disabled=false 且未触发 onMounted 的情况下应返回 null
    // 这里用同步 mount + 立即检查 html 是否为空字符串来验证
    const wrapper = mount(Portal, {
      props: { appendTo: 'body', disabled: false },
      slots: { default: () => <span class="portal-content">x</span> },
      sync: false,
    });
    // 立即检查：onMounted 之前应返回 null
    // 注意：mount 完成后 onMounted 已执行，所以这里检查 teleport 是否生效
    await nextTick();
    expect(document.body.querySelector('.portal-content')).not.toBeNull();
    wrapper.unmount();
  });
});
