import { vi } from 'vitest';
import Button from './index';
import { SearchOutlined } from '@xiaoye-ui/icons';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { asyncExpect, sleep } from '../../tests/utils';
import mountTest from '../../tests/shared/mountTest';
import { resetWarned } from './../_util/warning';
import focusTest from '../../tests/shared/focusTest';

describe('Button', () => {
  mountTest(Button);
  mountTest(Button.Group);
  focusTest(Button);
  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <Button>Follow</Button>;
      },
    });
  });

  it('create primary button', () => {
    const wrapper = mount({
      render() {
        return <Button type="primary">按钮</Button>;
      },
    });
    expect(wrapper.find('.xy-btn-primary').exists()).toBe(true);
  });

  it('renders Chinese characters correctly', async () => {
    const wrapper = mount({
      render() {
        return <Button>按钮</Button>;
      },
    });
    expect(wrapper.text()).toBe('按 钮');

    const wrapper1 = mount({
      render() {
        return (
          <Button>
            {/* <SearchOutlined v-slot:icon /> */}
            按钮
          </Button>
        );
      },
    });


    const wrapper2 = mount({
      render() {
        return (
          <Button>
            <SearchOutlined />
            按钮
          </Button>
        );
      },
    });
    // should not insert space when there is icon
    const wrapper3 = mount({
      render() {
        return (
          <Button>
            {/* <SearchOutlined slot="icon" /> */}
            按钮
          </Button>
        );
      },
    });
    // should not insert space when there is icon while loading
    const wrapper4 = mount({
      render() {
        return (
          <Button loading>
            {/* <SearchOutlined slot="icon" /> */}
            按钮
          </Button>
        );
      },
    });
    // should insert space while loading
    const wrapper5 = mount({
      render() {
        return <Button loading>按钮</Button>;
      },
    });
    const wrapper6 = mount({
      render() {
        return (
          <Button>
            <span>按钮</span>
          </Button>
        );
      },
    });
    await nextTick();
    // expect(wrapper6.find('.xy-btn-two-chinese-chars').exists()).toBe(true);
  });
  it('should change loading state instantly by default', async () => {
    const DefaultButton = {
      data() {
        return {
          loading: false,
        };
      },
      methods: {
        enterLoading() {
          this.loading = true;
        },
      },

      render() {
        return (
          <Button loading={this.loading} onClick={this.enterLoading}>
            Button
          </Button>
        );
      },
    };
    const wrapper = mount(DefaultButton, { sync: false });
    await asyncExpect(() => {
      wrapper.trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.xy-btn-loading').length).toBe(1);
    });
  });

  it('should change loading state with delay', async () => {
    const DefaultButton = {
      data() {
        return {
          loading: false,
        };
      },
      methods: {
        enterLoading() {
          this.loading = { delay: 1000 };
        },
      },

      render() {
        return (
          <Button loading={this.loading} onClick={this.enterLoading}>
            Button
          </Button>
        );
      },
    };
    const wrapper = mount(DefaultButton, { sync: false });
    await asyncExpect(() => {
      wrapper.trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('.xy-btn-loading').exists()).toBe(false);
    });
  });
  it('should not clickable when button is loading', () => {
    const onClick = vi.fn();
    const wrapper = mount({
      render() {
        return (
          <Button loading onClick={onClick}>
            button
          </Button>
        );
      },
    });
    wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalledWith();
  });
  it('should support link button', () => {
    const wrapper = mount({
      render() {
        return (
          <Button target="_blank" href="https://example.com">
            link button
          </Button>
        );
      },
    });
  });

  it('fixbug renders {0} , 0 and {false}', () => {
    const wrapper = mount({
      render() {
        return <Button>{0}</Button>;
      },
    });

    const wrapper1 = mount({
      render() {
        return <Button>0</Button>;
      },
    });

    const wrapper2 = mount({
      render() {
        return <Button>{false}</Button>;
      },
    });
  });

  it('should not render as link button when href is undefined', async () => {
    const wrapper = mount({
      render() {
        return (
          <Button type="primary" href={undefined}>
            button
          </Button>
        );
      },
    });
  });

  it('should support to change loading', async () => {
    const wrapper = mount(Button);
    wrapper.setProps({ loading: true });
    await sleep();
    expect(wrapper.findAll('.xy-btn-loading').length).toBe(1);
    wrapper.setProps({ loading: false });
    await sleep();
    expect(wrapper.findAll('.xy-btn-loading').length).toBe(0);
    wrapper.setProps({ loading: { delay: 50 } });
    await sleep();
    expect(wrapper.findAll('.xy-btn-loading').length).toBe(0);
    await sleep(50);
    expect(wrapper.findAll('.xy-btn-loading').length).toBe(1);
    wrapper.setProps({ loading: false });
    await sleep(50);
    expect(wrapper.findAll('.xy-btn-loading').length).toBe(0);
    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should warning when pass type=link and ghost=true', () => {
    resetWarned();
    const warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <Button type="link" ghost />;
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: [xiaoye-ui: Button] `link` or `text` button can't be a `ghost` button.",
    );
    warnSpy.mockRestore();
  });

  it('should warning when pass type=text and ghost=true', () => {
    resetWarned();
    const warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <Button type="text" ghost />;
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: [xiaoye-ui: Button] `link` or `text` button can't be a `ghost` button.",
    );
    warnSpy.mockRestore();
  });

  it('should not redirect when button is disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount({
      render() {
        return (
          <Button href="https://example.com" onClick={onClick} disabled>
            click me
          </Button>
        );
      },
    });
    await asyncExpect(() => {
      wrapper.trigger('click');
    });
    await asyncExpect(() => {
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
