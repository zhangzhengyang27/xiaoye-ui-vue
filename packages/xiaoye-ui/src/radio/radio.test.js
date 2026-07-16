import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../tests/utils';
import Radio, { Group, Button } from '.';
import focusTest from '../../tests/shared/focusTest';
import mountTest from '../../tests/shared/mountTest';

describe('Radio', () => {
  focusTest(Radio);
  mountTest(Radio);
  mountTest(Group);
  mountTest(Button);

  it('should render correctly', () => {
    mount({
      render() {
        return <Radio class="customized">Test</Radio>;
      },
    });
  });

  it('responses hover events', async () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    const wrapper = mount(
      {
        render() {
          return <Radio onMouseenter={onMouseEnter} onMouseleave={onMouseLeave} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper.find('label').trigger('mouseenter');
    });
    await asyncExpect(() => {
      expect(onMouseEnter).toHaveBeenCalled();
    });
    wrapper.find('label').trigger('mouseleave');
    await asyncExpect(() => {
      expect(onMouseLeave).toHaveBeenCalled();
    });
  });
});
