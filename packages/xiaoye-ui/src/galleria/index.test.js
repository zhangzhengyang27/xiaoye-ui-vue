import { mount } from '@vue/test-utils';
import Galleria from '.';
import mountTest from '../../tests/shared/mountTest';

const images = [
  { itemImageSrc: 'a.jpg', thumbnailImageSrc: 'a-t.jpg', alt: 'A', title: 'A' },
  { itemImageSrc: 'b.jpg', thumbnailImageSrc: 'b-t.jpg', alt: 'B', title: 'B' },
  { itemImageSrc: 'c.jpg', thumbnailImageSrc: 'c-t.jpg', alt: 'C', title: 'C' },
];

describe('Galleria', () => {
  mountTest(Galleria);

  it('marks with __XY_GALLERIA flag', () => {
    expect(Galleria.__XY_GALLERIA).toBe(true);
  });

  it('has install function', () => {
    expect(typeof Galleria.install).toBe('function');
  });

  it('renders basic galleria with value', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
    });
    expect(wrapper.find('.xy-galleria').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-content').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-items-container').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders null when value is empty', () => {
    const wrapper = mount(Galleria, {
      props: { value: [] },
    });
    expect(wrapper.find('.xy-galleria').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders thumbnails by default', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
    });
    expect(wrapper.find('.xy-galleria-thumbnails').exists()).toBe(true);
    expect(wrapper.findAll('.xy-galleria-thumbnail-item').length).toBe(3);
    wrapper.unmount();
  });

  it('hides thumbnails when showThumbnails is false', () => {
    const wrapper = mount(Galleria, {
      props: { value: images, showThumbnails: false },
    });
    expect(wrapper.find('.xy-galleria-thumbnails').exists()).toBe(false);
    wrapper.unmount();
  });

  it('renders item navigators when showItemNavigators is true', () => {
    const wrapper = mount(Galleria, {
      props: { value: images, showItemNavigators: true },
    });
    expect(wrapper.find('.xy-galleria-prev-button').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-next-button').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders indicators when showIndicators is true', () => {
    const wrapper = mount(Galleria, {
      props: { value: images, showIndicators: true },
    });
    expect(wrapper.find('.xy-galleria-indicator-list').exists()).toBe(true);
    expect(wrapper.findAll('.xy-galleria-indicator').length).toBe(3);
    wrapper.unmount();
  });

  it('renders header and footer slots', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
      slots: {
        header: () => 'HEADER',
        footer: () => 'FOOTER',
      },
    });
    expect(wrapper.find('.xy-galleria-header').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-header').text()).toBe('HEADER');
    expect(wrapper.find('.xy-galleria-footer').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-footer').text()).toBe('FOOTER');
    wrapper.unmount();
  });

  it('renders item slot template', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
      slots: {
        item: ({ item }) => `ITEM-${item.alt}`,
      },
    });
    expect(wrapper.find('.xy-galleria-item').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-item').text()).toBe('ITEM-A');
    wrapper.unmount();
  });

  it('renders thumbnail slot template', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
      slots: {
        thumbnail: ({ item }) => `THUMB-${item.alt}`,
      },
    });
    expect(wrapper.findAll('.xy-galleria-thumbnail').length).toBe(3);
    expect(wrapper.findAll('.xy-galleria-thumbnail')[0].text()).toBe('THUMB-A');
    wrapper.unmount();
  });

  it('renders caption slot template', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
      slots: {
        caption: ({ item }) => `CAPTION-${item.title}`,
      },
    });
    expect(wrapper.find('.xy-galleria-caption').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-caption').text()).toBe('CAPTION-A');
    wrapper.unmount();
  });

  it('applies circular class behavior', () => {
    const wrapper = mount(Galleria, {
      props: { value: images, circular: true, showItemNavigators: true },
    });
    // At index 0 with circular, prev button should not be disabled
    expect(wrapper.find('.xy-galleria-prev-button').attributes('disabled')).toBeUndefined();
    wrapper.unmount();
  });

  it('disables prev button at index 0 without circular', () => {
    const wrapper = mount(Galleria, {
      props: { value: images, circular: false, showItemNavigators: true, activeIndex: 0 },
    });
    expect(wrapper.find('.xy-galleria-prev-button').attributes('disabled')).toBeDefined();
    wrapper.unmount();
  });

  it('disables next button at last index without circular', () => {
    const wrapper = mount(Galleria, {
      props: {
        value: images,
        circular: false,
        showItemNavigators: true,
        activeIndex: 2,
      },
    });
    expect(wrapper.find('.xy-galleria-next-button').attributes('disabled')).toBeDefined();
    wrapper.unmount();
  });

  it('emits update:activeIndex when next button clicked', async () => {
    const wrapper = mount(Galleria, {
      props: { value: images, showItemNavigators: true, activeIndex: 0 },
    });
    await wrapper.find('.xy-galleria-next-button').trigger('click');
    const emitted = wrapper.emitted('update:activeIndex');
    expect(emitted).toBeTruthy();
    expect(emitted[0]).toEqual([1]);
    wrapper.unmount();
  });

  it('renders thumbnail navigators by default', () => {
    const wrapper = mount(Galleria, {
      props: { value: images },
    });
    expect(wrapper.find('.xy-galleria-thumbnail-prev-button').exists()).toBe(true);
    expect(wrapper.find('.xy-galleria-thumbnail-next-button').exists()).toBe(true);
    wrapper.unmount();
  });

  it('hides thumbnail navigators when showThumbnailNavigators is false', () => {
    const wrapper = mount(Galleria, {
      props: { value: images, showThumbnailNavigators: false },
    });
    expect(wrapper.find('.xy-galleria-thumbnail-prev-button').exists()).toBe(false);
    expect(wrapper.find('.xy-galleria-thumbnail-next-button').exists()).toBe(false);
    wrapper.unmount();
  });
});
