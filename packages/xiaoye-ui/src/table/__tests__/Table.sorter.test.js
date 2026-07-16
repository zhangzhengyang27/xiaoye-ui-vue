import { vi } from 'vitest';
import * as Vue from 'vue';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Table from '..';

describe('Table.sorter', () => {
  const sorterFn = (a, b) => a.name[0].charCodeAt() - b.name[0].charCodeAt();

  const column = {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: sorterFn,
  };

  const data = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy' },
    { key: 2, name: 'Tom' },
    { key: 3, name: 'Jerry' },
  ];

  function getTableOptions(props = {}, columnProps = {}) {
    return {
      props: {
        columns: [
          {
            ...column,
            ...columnProps,
          },
        ],
        dataSource: data,
        pagination: false,
        ...props,
      },
      sync: false,
      attachedToDocument: true,
    };
  }

  function renderedNames(wrapper) {
    return wrapper.findAllComponents({ name: 'BodyRow' }).map(row => {
      return row.props().record.name;
    });
  }

  it('renders sorter icon correctly', async () => {
    const wrapper = mount(Table, getTableOptions());
    await Vue.nextTick();
    expect(wrapper.find('thead').html()).toMatchSnapshot();
  });

  it('default sort order ascend', async () => {
    const wrapper = mount(
      Table,
      getTableOptions(
        {},
        {
          defaultSortOrder: 'ascend',
        },
      ),
    );
    await Vue.nextTick();
    expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom']);
  });

  it('default sort order descend', async () => {
    const wrapper = mount(
      Table,
      getTableOptions(
        {},
        {
          defaultSortOrder: 'descend',
        },
      ),
    );
    await Vue.nextTick();
    expect(renderedNames(wrapper)).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry']);
  });

  it('sort records', async () => {
    const wrapper = mount(Table, getTableOptions());
    await asyncExpect(() => {
      // descent
      wrapper.find('.xy-table-column-sorters').trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('.xy-table-tbody').text()).toEqual(
        ['Jack', 'Jerry', 'Lucy', 'Tom'].join(''),
      );

      // ascent
      wrapper.find('.xy-table-column-sorters').trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('.xy-table-tbody').text()).toEqual(
        ['Tom', 'Lucy', 'Jack', 'Jerry'].join(''),
      );
    });
  });

  it('can be controlled by sortOrder', async () => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [{ ...column, sortOrder: 'ascend' }],
      }),
    );
    await Vue.nextTick();
    expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom']);
  });

  it('fires change event', async () => {
    const handleChange = vi.fn();
    const wrapper = mount(Table, getTableOptions({ onChange: handleChange }, {}));

    wrapper.find('.xy-table-column-sorters').trigger('click');
    await asyncExpect(() => {
      const sorter1 = handleChange.mock.calls[0][2];
      expect(sorter1.column.dataIndex).toBe('name');
      expect(sorter1.order).toBe('ascend');
      expect(sorter1.field).toBe('name');
      expect(sorter1.columnKey).toBe('name');
    });
    wrapper.find('.xy-table-column-sorters').trigger('click');
    await asyncExpect(() => {
      const sorter2 = handleChange.mock.calls[1][2];
      expect(sorter2.column.dataIndex).toBe('name');
      expect(sorter2.order).toBe('descend');
      expect(sorter2.field).toBe('name');
      expect(sorter2.columnKey).toBe('name');
    });

    wrapper.find('.xy-table-column-sorters').trigger('click');
    await asyncExpect(() => {
      const sorter3 = handleChange.mock.calls[2][2];
      expect(sorter3.column).toBe(undefined);
      expect(sorter3.order).toBe(undefined);
      expect(sorter3.field).toBe('name');
      expect(sorter3.columnKey).toBe('name');
    });
  });

  it('works with grouping columns in controlled mode', async () => {
    const columns = [
      {
        title: 'group',
        key: 'group',
        children: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: sorterFn,
            sortOrder: 'descend',
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          },
        ],
      },
    ];
    const testData = [
      { key: 0, name: 'Jack', age: 11 },
      { key: 1, name: 'Lucy', age: 20 },
      { key: 2, name: 'Tom', age: 21 },
      { key: 3, name: 'Jerry', age: 22 },
    ];
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: testData,
      },
      sync: false,
    });
    await Vue.nextTick();
    expect(renderedNames(wrapper)).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry']);
  });
});
