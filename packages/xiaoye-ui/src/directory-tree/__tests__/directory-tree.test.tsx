import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import DirectoryTree from '..';
import mountTest from '../../../tests/shared/mountTest';

const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];

describe('DirectoryTree', () => {
  mountTest(DirectoryTree);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks with __XY_DIRECTORY_TREE flag', () => {
    expect((DirectoryTree as any).__XY_DIRECTORY_TREE).toBe(true);
  });

  it('has install function', () => {
    expect(typeof DirectoryTree.install).toBe('function');
  });

  it('renders directory tree with directory class', () => {
    const wrapper = mount(DirectoryTree, {
      props: { treeData },
      attachTo: 'body',
    });
    // 目录树根节点应带有 directory 修饰类
    expect(document.querySelector('.xy-directory-tree-directory')).not.toBeNull();
    wrapper.unmount();
  });

  it('defaults blockNode to true', () => {
    const wrapper = mount(DirectoryTree, {
      props: { treeData },
      attachTo: 'body',
    });
    // 默认占满整行
    expect(document.querySelector('.xy-directory-tree-block-node')).not.toBeNull();
    wrapper.unmount();
  });

  it('defaults showIcon to true', () => {
    const wrapper = mount(DirectoryTree, {
      props: { treeData },
      attachTo: 'body',
    });
    // 默认不隐藏图标
    expect(document.querySelector('.xy-directory-tree-icon-hide')).toBeNull();
    wrapper.unmount();
  });

  it('passes treeData to underlying Tree', () => {
    const wrapper = mount(DirectoryTree, {
      props: { treeData },
      attachTo: 'body',
    });
    const tree = wrapper.findComponent({ name: 'XYTree' });
    expect(tree.props('treeData')).toStrictEqual(treeData);
    wrapper.unmount();
  });

  it('emits update:expandedKeys on expand', async () => {
    const wrapper = mount(DirectoryTree, {
      props: { treeData },
      attachTo: 'body',
    });
    const tree = wrapper.findComponent({ name: 'XYTree' });
    await tree.vm.$emit('expand', ['0-0'], {
      node: { key: '0-0' },
      expanded: true,
      nativeEvent: new MouseEvent('click'),
    });
    expect(wrapper.emitted('update:expandedKeys')).toBeTruthy();
    wrapper.unmount();
  });
});
