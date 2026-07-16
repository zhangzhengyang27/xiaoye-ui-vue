import { mount } from '@vue/test-utils';
import Layout from '..';
import mountTest from '../../../tests/shared/mountTest';
import { sleep } from '../../../tests/utils';

const { Sider, Content } = Layout;

describe('Layout', () => {
  mountTest(Layout);
  mountTest(Content);
  mountTest(Sider);
  it('detect the sider as children', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Layout>
              <Sider>Sider</Sider>
              <Content>Content</Content>
            </Layout>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    expect(wrapper.find('.xy-layout').classes()).toContain('xy-layout-has-sider');
  });

  it('detect the sider inside the children', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Layout>
              <div>
                <Sider>Sider</Sider>
              </div>
              <Content>Content</Content>
            </Layout>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    expect(wrapper.find('.xy-layout').classes()).toContain('xy-layout-has-sider');
  });

  it('detect xy-layout-sider-has-trigger class in sider when xy-layout-sider-trigger div tag exists', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Layout>
              <div>
                <Sider collapsible>Sider</Sider>
              </div>
              <Content>Content</Content>
            </Layout>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    expect(wrapper.find('.xy-layout-sider').classes()).toContain('xy-layout-sider-has-trigger');
  });
});
