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
});
