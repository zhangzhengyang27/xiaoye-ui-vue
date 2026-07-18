import { mount } from '@vue/test-utils';
import DataView from '.';
import mountTest from '../../tests/shared/mountTest';

describe('DataView', () => {
  mountTest(DataView);

  it('has correct internal flags', () => {
    expect(DataView.__XY_DATA_VIEW).toBe(true);
  });

  it('has install method', () => {
    expect(typeof DataView.install).toBe('function');
  });

  it('renders list layout by default', () => {
    const items = [{ name: 'item1' }, { name: 'item2' }];
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={items}>
              {{
                list: scope => (
                  <ul>
                    {scope.items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-dataview').exists()).toBe(true);
    expect(wrapper.find('.xy-dataview-list').exists()).toBe(true);
    expect(wrapper.findAll('li').length).toBe(2);
    wrapper.unmount();
  });

  it('renders grid layout', () => {
    const items = [{ name: 'item1' }, { name: 'item2' }];
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={items} layout="grid">
              {{
                grid: scope => (
                  <div class="grid-container">
                    {scope.items.map((item, index) => (
                      <div key={index} class="grid-item">
                        {item.name}
                      </div>
                    ))}
                  </div>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-dataview-grid').exists()).toBe(true);
    expect(wrapper.findAll('.grid-item').length).toBe(2);
    wrapper.unmount();
  });

  it('renders empty message when value is empty', () => {
    const wrapper = mount(DataView, {
      props: { value: [] },
      sync: false,
    });
    expect(wrapper.find('.xy-dataview-empty-message').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders header and footer slots', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={[{ name: 'x' }]}>
              {{
                header: () => <div class="custom-header">Header</div>,
                footer: () => <div class="custom-footer">Footer</div>,
                list: () => <div class="list-content">List</div>,
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-dataview-header .custom-header').exists()).toBe(true);
    expect(wrapper.find('.xy-dataview-footer .custom-footer').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders pagination when enabled', () => {
    const items = Array.from({ length: 20 }, (_, i) => ({ name: `item${i}` }));
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={items} pagination={true} rows={5} alwaysShowPagination={true}>
              {{
                list: scope => (
                  <ul>
                    {scope.items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-dataview-pagination').exists()).toBe(true);
    wrapper.unmount();
  });

  // ===== 以下为补充测试 =====

  it('grid 模式下正确渲染每个网格项的内容', () => {
    // 验证 grid 模式下 scope.items 透传正确，每个 grid-item 内容与原始数据对应
    const items = [{ name: 'alpha' }, { name: 'beta' }, { name: 'gamma' }];
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={items} layout="grid">
              {{
                grid: scope => (
                  <div class="grid-container">
                    {scope.items.map((item, index) => (
                      <div key={index} class="grid-item" data-name={item.name}>
                        {item.name}
                      </div>
                    ))}
                  </div>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    const gridItems = wrapper.findAll('.grid-item');
    expect(gridItems.length).toBe(3);
    expect(gridItems[0].text()).toBe('alpha');
    expect(gridItems[1].text()).toBe('beta');
    expect(gridItems[2].text()).toBe('gamma');
    wrapper.unmount();
  });

  it('list 模式下正确渲染每个列表项的内容', () => {
    // 验证 list 模式下 scope.items 透传正确，每个 li 内容与原始数据对应
    const items = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={items} layout="list">
              {{
                list: scope => (
                  <ul>
                    {scope.items.map((item, index) => (
                      <li key={index} class="list-item">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    const listItems = wrapper.findAll('.list-item');
    expect(listItems.length).toBe(3);
    expect(listItems[0].text()).toBe('one');
    expect(listItems[1].text()).toBe('two');
    expect(listItems[2].text()).toBe('three');
    // 根元素应具有 xy-dataview-list 类名
    expect(wrapper.find('.xy-dataview-list').exists()).toBe(true);
    wrapper.unmount();
  });

  it('空数据时使用自定义 empty 插槽渲染', () => {
    // 验证当 value 为空数组时，自定义 empty 插槽被调用并接收 layout 参数
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={[]} layout="grid">
              {{
                empty: scope => <div class="custom-empty">暂无数据 - {scope.layout}</div>,
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-dataview-empty-message').exists()).toBe(true);
    expect(wrapper.find('.custom-empty').exists()).toBe(true);
    expect(wrapper.find('.custom-empty').text()).toContain('暂无数据');
    expect(wrapper.find('.custom-empty').text()).toContain('grid');
    wrapper.unmount();
  });

  it('分页位置为 top 时只显示顶部分页', () => {
    // 验证 paginationPosition="top" 时，仅顶部分页渲染，底部分页不渲染
    const items = Array.from({ length: 20 }, (_, i) => ({ name: `item${i}` }));
    const wrapper = mount(
      {
        render() {
          return (
            <DataView
              value={items}
              pagination={true}
              rows={5}
              paginationPosition="top"
              alwaysShowPagination={true}
            >
              {{
                list: scope => (
                  <ul>
                    {scope.items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-dataview-pagination-top').exists()).toBe(true);
    expect(wrapper.find('.xy-dataview-pagination-bottom').exists()).toBe(false);
    wrapper.unmount();
  });

  it('sortField 和 sortOrder 属性正确应用排序', () => {
    // 验证 sortField 指定字段、sortOrder=1 升序时，数据按字段值升序排列
    const items = [{ age: 30 }, { age: 10 }, { age: 20 }];
    const wrapper = mount(
      {
        render() {
          return (
            <DataView value={items} sortField="age" sortOrder={1}>
              {{
                list: scope => (
                  <ul>
                    {scope.items.map((item, index) => (
                      <li key={index} class="age-item">
                        {item.age}
                      </li>
                    ))}
                  </ul>
                ),
              }}
            </DataView>
          );
        },
      },
      { sync: false },
    );
    const ageItems = wrapper.findAll('.age-item');
    expect(ageItems.length).toBe(3);
    // 升序：10, 20, 30
    expect(ageItems[0].text()).toBe('10');
    expect(ageItems[1].text()).toBe('20');
    expect(ageItems[2].text()).toBe('30');
    wrapper.unmount();
  });
});
