import { mount } from '@vue/test-utils';
import Flex from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Flex', () => {
  mountTest(Flex);

  it('Flex', () => {
    const wrapper = mount({
      render() {
        return <Flex justify="center">test</Flex>;
      },
    });
    const wrapper2 = mount({
      render() {
        return <Flex gap={100}>test</Flex>;
      },
    });
    expect(wrapper.classes('xy-flex')).toBeTruthy();
    expect(wrapper.find('.xy-flex-justify-center')).toBeTruthy();
    expect(wrapper2.classes('xy-flex')).toBeTruthy();
    expect(wrapper2.element.style.gap).toBe('100px');
  });

  it('Component work', () => {
    const wrapper = mount({
      render() {
        return <Flex>test</Flex>;
      },
    });
    const wrapper2 = mount({
      render() {
        return <Flex component="span">test</Flex>;
      },
    });
    expect(wrapper.find('.xy-flex').element.tagName).toBe('DIV');
    expect(wrapper2.find('.xy-flex').element.tagName).toBe('SPAN');
  });

  it('when vertical=true should stretch work', () => {
    const wrapper = mount({
      render() {
        return <Flex vertical>test</Flex>;
      },
    });
    const wrapper2 = mount({
      render() {
        return (
          <Flex vertical align="center">
            test
          </Flex>
        );
      },
    });
    expect(wrapper.find('.xy-flex-align-stretch')).toBeTruthy();
    expect(wrapper2.find('.xy-flex-align-center')).toBeTruthy();
  });
});
