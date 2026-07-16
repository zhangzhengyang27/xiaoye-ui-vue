import FloatButton from './index';
import { mount } from '@vue/test-utils';
import mountTest from '../../tests/shared/mountTest';

describe('FloatButton', () => {
  mountTest(FloatButton);
  mountTest(FloatButton.Group);
  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <FloatButton></FloatButton>;
      },
    });
  });

  it('create primary button', () => {
    const wrapper = mount({
      render() {
        return <FloatButton type="primary">按钮</FloatButton>;
      },
    });
    expect(wrapper.find('.xy-float-btn-primary').exists()).toBe(true);
  });

  it('fixbug renders {0} , 0 and {false}', () => {
    const wrapper = mount({
      render() {
        return <FloatButton>{0}</FloatButton>;
      },
    });

    const wrapper1 = mount({
      render() {
        return <FloatButton>0</FloatButton>;
      },
    });

    const wrapper2 = mount({
      render() {
        return <FloatButton>{false}</FloatButton>;
      },
    });
  });
});
