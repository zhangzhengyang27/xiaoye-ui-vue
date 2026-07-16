import { mount } from '@vue/test-utils';
import { asyncExpect, setMockDate } from '../../tests/utils';
import DatePicker from '.';
import focusTest from '../../tests/shared/focusTest';

const { WeekPicker } = DatePicker;
vi.mock('../../_util/Portal');
describe('WeekPicker', () => {
  beforeEach(() => {
    setMockDate();
  });
  focusTest(WeekPicker);

  it('should support style prop', async () => {
    const wrapper = mount(
      {
        render() {
          return <WeekPicker style={{ width: '400px' }} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
    });
  });
});
