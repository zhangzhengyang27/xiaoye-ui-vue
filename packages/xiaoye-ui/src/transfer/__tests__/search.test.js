import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Search from '../search';
import Transfer from '../index';

describe('Search', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('should show cross icon when input value exists', () => {
    const props = {
      props: {
        value: '',
      },
    };
    const wrapper = mount(Search, props);

    expect(wrapper.html()).toMatchSnapshot();

    wrapper.setProps({ value: 'a' });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('onSearch', async () => {
    const dataSource = [
      {
        key: 'a',
        title: 'a',
        description: 'a',
      },
      {
        key: 'b',
        title: 'b',
        description: 'b',
      },
      {
        key: 'c',
        title: 'c',
        description: 'c',
      },
    ];

    const onSearch = vi.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <Transfer
              dataSource={dataSource}
              selectedKeys={[]}
              targetKeys={[]}
              render={item => item.title}
              onSearch={onSearch}
              showSearch
            />
          );
        },
      },
      {
        sync: false,
      },
    );
    await asyncExpect(() => {
      const input = wrapper.findAll('.xy-input')[0];
      input.element.value = 'a';
      input.trigger('input');
    });

    await asyncExpect(() => {
      expect(onSearch).toBeCalledWith('left', 'a');
    });

    onSearch.mockReset();

    wrapper.findAll('.xy-input-clear-icon')[0].trigger('click');
    expect(onSearch).toBeCalledWith('left', '');
  });
});
