import { mount } from '@vue/test-utils';
import Badge from './index';
import mountTest from '../../tests/shared/mountTest';

import { asyncExpect } from '../../tests/utils';
describe('Badge', () => {
  it('badge dot not scaling count > 9', () => {
    const badge = mount({
      render() {
        return <Badge count={10} dot />;
      },
    });
    expect(badge.findAll('.xy-card-multiple-words').length).toBe(0);
  });
  it('badge should support float number', () => {
    let wrapper = mount({
      render() {
        return <Badge count={3.5} />;
      },
    });
    wrapper = mount({
      render() {
        return <Badge count={3.5} />;
      },
    });
  });
  it('badge dot not showing count == 0', () => {
    const badge = mount({
      render() {
        return <Badge count={0} dot />;
      },
    });
    expect(badge.findAll('.xy-badge-dot').length).toBe(0);
  });

  it('should have an overriden title attribute', () => {
    const badge = mount({
      render() {
        return <Badge count={10} title="Custom title" />;
      },
    });
    expect(badge.find('.xy-scroll-number').element.attributes.getNamedItem('title').value).toEqual(
      'Custom title',
    );
  });

  // it('should be composable with Tooltip', async () => {
  //   const wrapper = mount({
  //     render () {
  //       return <Tooltip ref='tooltip' title='Fix the error'>
  //         <Badge status='error' />
  //       </Tooltip>
  //     },
  //   }, { sync: false })
  //   await asyncExpect(() => {
  //     wrapper.find({ name: 'XYBadge' }).trigger('mouseenter')
  //   }, 0)

  //   expect(wrapper.vm.$refs.tooltip.sVisible).toBe(true)
  // })

  it('should render when count is changed', async () => {
    const wrapper = mount(Badge, {
      props: {
        count: 9,
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.setProps({ count: 10 });
    }, 100);
    await asyncExpect(() => {
      wrapper.setProps({ count: 11 });
    }, 100);
    await asyncExpect(() => {
      wrapper.setProps({ count: 11 });
    }, 100);
    await asyncExpect(() => {
      wrapper.setProps({ count: 10 });
    }, 100);
    await asyncExpect(() => {
      wrapper.setProps({ count: 9 });
    }, 100);
    await asyncExpect(() => {}, 100);
  });

  it('should be compatible with borderColor style', () => {
    const wrapper = mount({
      render() {
        return (
          <Badge
            count={4}
            style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }}
          />
        );
      },
    });
  });

  it('should support offset when count is a VueNode', () => {
    const wrapper = mount({
      render() {
        return (
          <Badge count={<span class="custom" style={{ color: '#f5222d' }} />} offset={[10, 20]}>
            <a href="#" class="head-example">
              head
            </a>
          </Badge>
        );
      },
    });
  });
  it('render correct with negative number', () => {
    const wrapper = mount({
      render() {
        return (
          <div>
            <Badge count="-10" />
            <Badge count={-10} />
          </div>
        );
      },
    });
  });

  it('text works with vnode', () => {
    const wrapper = mount({
      render() {
        return <Badge status="success" text={<span>hello</span>} />;
      },
    });
  });
});

describe('Ribbon', () => {
  mountTest(Badge.Ribbon);

  describe('placement', () => {
    it('works with `start` & `end` placement', () => {
      const wrapperStart = mount({
        render() {
          return (
            <Badge.Ribbon placement="start">
              <div />
            </Badge.Ribbon>
          );
        },
      });

      expect(wrapperStart.findAll('.xy-ribbon-placement-start').length).toEqual(1);

      const wrapperEnd = mount({
        render() {
          return (
            <Badge.Ribbon placement="end">
              <div />
            </Badge.Ribbon>
          );
        },
      });
      expect(wrapperEnd.findAll('.xy-ribbon-placement-end').length).toEqual(1);
    });
  });

  describe('color', () => {
    it('works with preset color', () => {
      const wrapper = mount({
        render() {
          return (
            <Badge.Ribbon color="green">
              <div />
            </Badge.Ribbon>
          );
        },
      });
      expect(wrapper.findAll('.xy-ribbon-color-green').length).toEqual(1);
    });
  });

  describe('text', () => {
    it('works with string', () => {
      const wrapper = mount({
        render() {
          return (
            <Badge.Ribbon text="cool">
              <div />
            </Badge.Ribbon>
          );
        },
      });
      expect(wrapper.find('.xy-ribbon').text()).toEqual('cool');
    });
    it('works with element', () => {
      const wrapper = mount({
        render() {
          return (
            <Badge.Ribbon text={<span class="cool" />}>
              <div />
            </Badge.Ribbon>
          );
        },
      });
      expect(wrapper.findAll('.cool').length).toEqual(1);
    });
  });
});
