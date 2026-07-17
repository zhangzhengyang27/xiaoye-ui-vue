import { mount } from '@vue/test-utils';
import Toolbar from '.';
import mountTest from '../../tests/shared/mountTest';

describe('Toolbar', () => {
  mountTest(Toolbar);

  it('renders three groups with default slots', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Toolbar>
              {{
                start: () => <span class="start">start</span>,
                center: () => <span class="center">center</span>,
                end: () => <span class="end">end</span>,
              }}
            </Toolbar>
          );
        },
      },
      { sync: false },
    );
    expect(wrapper.find('.xy-toolbar').exists()).toBe(true);
    expect(wrapper.find('.xy-toolbar-group-start .start').exists()).toBe(true);
    expect(wrapper.find('.xy-toolbar-group-center .center').exists()).toBe(true);
    expect(wrapper.find('.xy-toolbar-group-end .end').exists()).toBe(true);
    wrapper.unmount();
  });

  it('applies aria-labelledby attribute', () => {
    const wrapper = mount(Toolbar, {
      props: { ariaLabelledby: 'my-label' },
      slots: { start: () => 'x' },
      sync: false,
    });
    expect(wrapper.find('[role="toolbar"]').attributes('aria-labelledby')).toBe('my-label');
    wrapper.unmount();
  });

  it('renders empty groups when slots not provided', () => {
    const wrapper = mount(Toolbar, { sync: false });
    expect(wrapper.findAll('.xy-toolbar-group').length).toBe(3);
    wrapper.unmount();
  });
});
