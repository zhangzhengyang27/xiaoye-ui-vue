import { mount } from '@vue/test-utils';
import Segmented from './index';
import mountTest from '../../tests/shared/mountTest';

describe('Segmented', () => {
  mountTest(Segmented);

  it('should render options correctly', () => {
    const wrapper = mount({
      render() {
        return <Segmented options={[1, 2, 3, 4, 5]} value={1} />;
      },
    });
    expect(wrapper.findAll('.xy-segmented-item').length).toBe(5);
    expect(wrapper.find('.xy-segmented-item-selected').text()).toBe('1');
  });
});
