import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Transfer from '..';
import * as Vue from 'vue';
import { sleep, asyncExpect } from '../../tests/utils';
import mountTest from '../../tests/shared/mountTest';

const listCommonProps = {
  dataSource: [
    {
      key: 'a',
      title: 'a',
    },
    {
      key: 'b',
      title: 'b',
    },
    {
      key: 'c',
      title: 'c',
      disabled: true,
    },
  ],
  selectedKeys: ['a'],
  targetKeys: ['b'],
  lazy: false,
};

const listDisabledProps = {
  dataSource: [
    {
      key: 'a',
      title: 'a',
      disabled: true,
    },
    {
      key: 'b',
      title: 'b',
    },
  ],
  selectedKeys: ['a', 'b'],
  targetKeys: [],
  lazy: false,
};

const searchTransferProps = {
  dataSource: [
    {
      key: '0',
      title: 'content1',
      description: 'description of content1',
      chosen: false,
    },
    {
      key: '1',
      title: 'content2',
      description: 'description of content2',
      chosen: false,
    },
    {
      key: '2',
      title: 'content3',
      description: 'description of content3',
      chosen: false,
    },
    {
      key: '3',
      title: 'content4',
      description: 'description of content4',
      chosen: false,
    },
    {
      key: '4',
      title: 'content5',
      description: 'description of content5',
      chosen: false,
    },
    {
      key: '5',
      title: 'content6',
      description: 'description of content6',
      chosen: false,
    },
  ],
  selectedKeys: [],
  targetKeys: ['3', '4'],
  lazy: false,
};

describe('Transfer', () => {
  mountTest(Transfer);
  it('should render correctly', () => {
    const wrapper = mount({
      setup() {
        return () => <Transfer {...{ ...listCommonProps }} />;
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should move selected keys to corresponding list', async () => {
    const handleChange = vi.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onChange: handleChange }} />;
        },
      },
      {
        sync: false,
      },
    );
    await Vue.nextTick();
    wrapper.findAll('.xy-btn')[0].trigger('click'); // move selected keys to right list
    expect(handleChange).toHaveBeenCalledWith(['a', 'b'], 'right', ['a']);
  });
  it('should move selected keys expect disabled to corresponding list', async () => {
    const handleChange = vi.fn();
    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listDisabledProps, onChange: handleChange }} />;
        },
      },
      {
        sync: false,
      },
    );
    await Vue.nextTick();
    wrapper.findAll('.xy-btn')[0].trigger('click');
    expect(handleChange).toHaveBeenCalledWith(['b'], 'right', ['b']);
  });

  it('should uncheck checkbox when click on checked item', async () => {
    const handleSelectChange = vi.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onSelectChange: handleSelectChange }} />;
        },
      },
      {
        sync: false,
      },
    );

    await sleep();
    wrapper.findAll('.xy-transfer-list-content-item')[0].trigger('click');
    expect(handleSelectChange).toHaveBeenLastCalledWith([], []);
  });

  it('should check checkbox when click on unchecked item', async () => {
    const handleSelectChange = vi.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onSelectChange: handleSelectChange }} />;
        },
      },
      {
        sync: false,
      },
    );

    await sleep();
    wrapper.findAll('.xy-transfer-list-content-item')[2].trigger('click');
    await sleep();
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], ['b']);
  });

  it('should not check checkbox when click on disabled item', async () => {
    const handleSelectChange = vi.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onSelectChange: handleSelectChange }} />;
        },
      },
      {
        sync: false,
      },
    );

    await sleep();
    wrapper.findAll('.xy-transfer-list-content-item')[1].trigger('click');
    expect(handleSelectChange).not.toHaveBeenCalled();
  });

  it.skip('should check all item when click on check all', async () => {
    const handleSelectChange = vi.fn();
    const wrapper = mount(Transfer, {
      props: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    await Vue.nextTick();
    wrapper
      .findAll('.xy-transfer-list-header input[type="checkbox"]')
      .filter(n => {
        return !n.vnode.data.domProps.checked;
      })
      .trigger('change');
    expect(handleSelectChange).toHaveBeenCalledWith(['a'], ['b']);
  });

  it.skip('should uncheck all item when click on uncheck all', async () => {
    const handleSelectChange = vi.fn();
    const wrapper = mount(Transfer, {
      props: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    await Vue.nextTick();
    wrapper
      .findAll('.xy-transfer-list-header input[type="checkbox"]')
      .filter(n => {
        return n.vnode.data.domProps.checked;
      })
      .trigger('change');
    expect(handleSelectChange).toHaveBeenCalledWith([], []);
  });

  it('should call `filterOption` when use input in search box', async () => {
    const filterOption = (inputValue, option) => inputValue === option.title;

    const wrapper = mount(
      {
        setup() {
          return () => (
            <Transfer
              {...{
                ...listCommonProps,
                showSearch: true,
                filterOption,
              }}
            />
          );
        },
      },
      {
        sync: false,
      },
    );

    await Vue.nextTick();
    const input = wrapper.findAll('.xy-transfer-list-body-search-wrapper input')[0];
    input.element.value = 'a';
    input.trigger('input');
    await Vue.nextTick();
    expect(
      wrapper
        .findAll('.xy-transfer-list-content')[0]
        .find('.xy-transfer-list-content-item')
        .findAll('input[type="checkbox"]'),
    ).toHaveLength(1);
  });

  it('should display the correct count of items when filter by input', async () => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const wrapper = mount(
      {
        setup() {
          return () => (
            <Transfer
              {...{
                ...searchTransferProps,
                showSearch: true,
                filterOption,
                render: renderFunc,
              }}
            />
          );
        },
      },
      {
        sync: false,
      },
    );

    await Vue.nextTick();
    const input = wrapper.findAll('.xy-transfer-list-body-search-wrapper input')[0];
    input.element.value = 'content2';
    input.trigger('input');
    await Vue.nextTick();
    expect(
      wrapper
        .findAll('.xy-transfer-list')[0]
        .findAll('.xy-transfer-list-header-selected > span')[0]
        .text()
        .trim(),
    ).toEqual('1 item');
  });

  it.skip('should just check the filtered item when click on check all after search by input', async () => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const handleSelectChange = vi.fn();
    const wrapper = mount(Transfer, {
      props: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: renderFunc,
      },
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    await Vue.nextTick();
    const input = wrapper.findAll('.xy-transfer-list-body-search-wrapper input')[0];
    input.element.value = 'content2';
    input.trigger('input');
    await Vue.nextTick();
    wrapper
      .findAll('.xy-transfer-list')[0]
      .findAll('.xy-transfer-list-header input[type="checkbox"]')
      .filter(n => {
        return !n.vnode.data.domProps.checked;
      })
      .trigger('change');
    expect(handleSelectChange).toHaveBeenCalledWith(['1'], []);
  });

  it.skip('should transfer just the filtered item after search by input', async () => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const handleChange = vi.fn();
    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      wrapper.setProps({
        selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
      });
    };
    const wrapper = mount(Transfer, {
      props: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: renderFunc,
      },
      listeners: {
        selectChange: handleSelectChange,
        change: handleChange,
      },
      sync: false,
    });
    await Vue.nextTick();
    const input = wrapper.findAll('.xy-transfer-list-body-search-wrapper input')[0];
    input.element.value = 'content2';
    input.trigger('input');
    await Vue.nextTick();
    wrapper
      .findAll('.xy-transfer-list')[0]
      .findAll('.xy-transfer-list-header input[type="checkbox"]')
      .filter(n => {
        return !n.element.checked;
      })
      .trigger('change');
    await Vue.nextTick();
    wrapper.findAll('.xy-btn')[0].trigger('click');
    expect(handleChange).toHaveBeenCalledWith(['1', '3', '4'], 'right', ['1']);
  });

  it.skip('should check correctly when there is a search text', async () => {
    const newProps = { ...listCommonProps };
    delete newProps.targetKeys;
    delete newProps.selectedKeys;
    const handleSelectChange = vi.fn();
    const wrapper = mount(Transfer, {
      props: {
        ...newProps,
        showSearch: true,
        render: item => item.title,
      },
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    await Vue.nextTick();
    wrapper
      .findAll('.xy-transfer-list-content-item')
      .filter(n => {
        return n.vnode.data.key === 'b';
      })
      .trigger('click');
    expect(handleSelectChange).toHaveBeenLastCalledWith(['b'], []);

    const input = wrapper.findAll('.xy-transfer-list-body-search-wrapper input')[0];
    input.element.value = 'a';
    input.trigger('input');
    await Vue.nextTick();
    wrapper
      .findAll('.xy-transfer-list')[0]
      .findAll('.xy-transfer-list-header input[type="checkbox"]')
      .trigger('change');
    await Vue.nextTick();
    expect(handleSelectChange).toHaveBeenLastCalledWith(['b', 'a'], []);
    wrapper
      .findAll('.xy-transfer-list')[0]
      .findAll('.xy-transfer-list-header input[type="checkbox"]')
      .trigger('change');
    expect(handleSelectChange).toHaveBeenLastCalledWith(['b'], []);
  });

  it('should show sorted targetkey', () => {
    const sortedTargetKeyProps = {
      dataSource: [
        {
          key: 'a',
          title: 'a',
        },
        {
          key: 'b',
          title: 'b',
        },
        {
          key: 'c',
          title: 'c',
        },
      ],
      targetKeys: ['c', 'b'],
      lazy: false,
    };
    const wrapper = mount({
      setup() {
        return () => <Transfer {...sortedTargetKeyProps} render={item => item.title} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should add custom styles when their props are provided', async () => {
    const style = {
      backgroundColor: 'red',
    };
    const listStyle = {
      backgroundColor: 'blue',
    };
    const operationStyle = {
      backgroundColor: 'yellow',
    };
    const transferProps = {
      props: {
        ...listCommonProps,
        listStyle,
        operationStyle,
      },
      style,
    };
    const component = mount(
      {
        render() {
          return <Transfer {...transferProps} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      const wrapper = component.find('.xy-transfer');
      // const list = component.findAll('.xy-transfer-list');
      // const listSource = list[0];
      // const listTarget = list[list.length - 1];
      // const operation = component.findAll('.xy-transfer-operation')[0];
      expect(wrapper.element.style).toHaveProperty('backgroundColor', 'red');
      // expect(listSource.element.style).toHaveProperty('backgroundColor', 'blue');
      // expect(listTarget.element.style).toHaveProperty('backgroundColor', 'blue');
      // expect(operation.element.style).toHaveProperty('backgroundColor', 'yellow');
    });
  });
});
