import { mount } from '@vue/test-utils';
import Result from '../index';
import Button from '../../button';
import { sleep } from '../../../tests/utils';

describe('Result', () => {
  it('🙂  successPercent should decide the progress status when it exists', () => {
    const wrapper = mount({
      render() {
        return (
          <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={
              <Button type="primary" key="console">
                Go Console
              </Button>
            }
          />
        );
      },
    });
    expect(wrapper.findAll('.anticon-check-circle')).toHaveLength(1);
  });

  it('🙂  different status, different class', async () => {
    const wrapper = mount(Result, { props: { status: 'warning' }, sync: false });
    expect(wrapper.findAll('.xy-result-warning')).toHaveLength(1);

    wrapper.setProps({
      status: 'error',
    });

    await sleep();
    expect(wrapper.findAll('.xy-result-error')).toHaveLength(1);

    wrapper.setProps({
      status: '500',
    });
    await sleep();
    expect(wrapper.findAll('.xy-result-500')).toHaveLength(1);
  });

  it('🙂  When status = 404, the icon is an image', () => {
    const wrapper = mount({
      render() {
        return <Result status="404" />;
      },
    });
    expect(wrapper.findAll('.xy-result-404 .xy-result-image')).toHaveLength(1);
  });

  it('🙂  When extra is undefined, the extra dom is undefined', () => {
    const wrapper = mount({
      render() {
        return <Result status="404" />;
      },
    });
    expect(wrapper.findAll('.xy-result-extra')).toHaveLength(0);
  });

  it('🙂  result should support className', () => {
    const wrapper = mount({
      render() {
        return <Result status="404" title="404" class="my-result" />;
      },
    });
    expect(wrapper.findAll('.xy-result.my-result')).toHaveLength(1);
  });
});
