import { mount } from '@vue/test-utils';
import PageHeader from '.';

describe('PageHeader', () => {
  it('pageHeader should not contain back it back', () => {
    const routes = [
      {
        path: 'index',
        breadcrumbName: 'First-level Menu',
      },
      {
        path: 'first',
        breadcrumbName: 'Second-level Menu',
      },
      {
        path: 'second',
        breadcrumbName: 'Third-level Menu',
      },
    ];
    const wrapper = mount({
      render() {
        return <PageHeader title="Page Title" breadcrumb={{ routes }} />;
      },
    });
    expect(wrapper.findAll('.xy-page-header-back')).toHaveLength(0);
  });

  it('pageHeader should have breadcrumb', () => {
    const routes = [
      {
        path: 'index',
        breadcrumbName: 'First-level Menu',
      },
    ];
    const wrapper = mount({
      render() {
        return <PageHeader title="Page Title" breadcrumb={{ routes }} />;
      },
    });
    expect(wrapper.findAll('.xy-breadcrumb')).toHaveLength(1);
    expect(wrapper.findAll('.xy-page-header-back')).toHaveLength(0);
  });

  it('pageHeader should no contain back', () => {
    const wrapper = mount({
      render() {
        return <PageHeader title="Page Title" backIcon={false} />;
      },
    });
    expect(wrapper.findAll('.xy-page-header-back')).toHaveLength(0);
  });

  it('pageHeader should contain back it back', () => {
    const callback = vi.fn(() => true);
    const wrapper = mount(
      {
        render() {
          return <PageHeader title="Page Title" onBack={callback} />;
        },
      },
      { sync: false },
    );
    expect(wrapper.findAll('.xy-page-header-back')).toHaveLength(1);
  });

  it('pageHeader onBack transfer', () => {
    const callback = vi.fn(() => true);
    const wrapper = mount(
      {
        render() {
          return <PageHeader title="Page Title" onBack={callback} />;
        },
      },
      { sync: false },
    );
    wrapper.find('div.xy-page-header-back-button').trigger('click');
    expect(callback).toHaveBeenCalled();
  });

  it('pageHeader should support class', () => {
    const wrapper = mount({
      render() {
        return <PageHeader title="Page Title" class="not-works" backIcon={false} />;
      },
    });
  });

  it('pageHeader should not render blank dom', () => {
    const wrapper = mount({
      render() {
        return <PageHeader title={false} />;
      },
    });
  });

  it('breadcrumbs and back icon can coexist', () => {
    const routes = [
      {
        path: 'index',
        breadcrumbName: 'First-level Menu',
      },
      {
        path: 'first',
        breadcrumbName: 'Second-level Menu',
      },
      {
        path: 'second',
        breadcrumbName: 'Third-level Menu',
      },
    ];
    const wrapper = mount({
      render() {
        return <PageHeader title="Title" breadcrumb={{ routes }} />;
      },
    });
    expect(wrapper.findAll('.xy-breadcrumb')).toHaveLength(1);

    const wrapperBack = mount({
      render() {
        return <PageHeader title="Title" breadcrumb={{ routes }} onBack={() => {}} />;
      },
    });
    expect(wrapperBack.findAll('.xy-breadcrumb')).toHaveLength(1);
  });
});
