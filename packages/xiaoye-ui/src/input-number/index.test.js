import { mount } from '@vue/test-utils';
import InputNumber from '.';
import focusTest from '../../tests/shared/focusTest';
import mountTest from '../../tests/shared/mountTest';

describe('InputNumber', () => {
  focusTest(InputNumber);
  mountTest(InputNumber);

  it('should return null when blur a empty input number', () => {
    const onChange = vi.fn();
    const wrapper = mount(
      {
        render() {
          return <InputNumber defaultValue="1" onChange={onChange} />;
        },
      },
      {
        sync: false,
      },
    );
    wrapper.find('input').element.value = '';
    wrapper.find('input').trigger('input');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
