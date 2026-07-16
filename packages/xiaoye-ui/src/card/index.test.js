import { mount } from '@vue/test-utils';
import Card from './index';
import Button from './../button/index';
import mountTest from '../../tests/shared/mountTest';

describe('Card', () => {
  mountTest(Card);
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  it('should still have padding when card which set padding to 0 is loading', () => {
    const wrapper = mount({
      render() {
        return (
          <Card loading bodyStyle={{ padding: 0 }}>
            xxx
          </Card>
        );
      },
    });
  });

  it('title should be vertically aligned', () => {
    const wrapper = mount({
      render() {
        return (
          <Card title="Card title" extra={<Button>Button</Button>} style={{ width: '300px' }}>
            <p>Card content</p>
          </Card>
        );
      },
    });
  });

  it('onTabChange should work', () => {
    const tabList = [
      {
        key: 'tab1',
        tab: 'tab1',
      },
      {
        key: 'tab2',
        tab: 'tab2',
      },
    ];
    const onTabChange = vi.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <Card onTabChange={onTabChange} tabList={tabList}>
              xxx
            </Card>
          );
        },
      },
      {
        sync: false,
      },
    );
    wrapper.findAll('.xy-tabs-tab')[1].trigger('click');
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('should not render when actions is number', () => {
    const wrapper = mount({
      render() {
        return (
          <Card title="Card title" actions={11}>
            <p>Card content</p>
          </Card>
        );
      },
    });
    expect(wrapper.findAll('.xy-card-actions').length).toBe(0);
  });
});
