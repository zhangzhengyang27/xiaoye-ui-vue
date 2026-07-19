import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Chips from '../Chips';
import mountTest from '../../../tests/shared/mountTest';

describe('Chips', () => {
  mountTest(Chips);

  it('should render correctly', async () => {
    const wrapper = mount(Chips, {
      props: {
        value: ['foo', 'bar'],
      },
    });

    await asyncExpect(() => {
      expect(wrapper.find('.xy-chips').exists()).toBe(true);
      expect(wrapper.find('.xy-chips-input').exists()).toBe(true);
      expect(wrapper.findAll('.xy-chips-item').length).toBe(2);
      expect(wrapper.findAll('.xy-chips-item-label')[0].text()).toBe('foo');
      expect(wrapper.findAll('.xy-chips-item-label')[1].text()).toBe('bar');
    });
  });

  it('should add chip by enter key', async () => {
    const wrapper = mount(Chips, {
      props: {
        value: [],
      },
    });

    const input = wrapper.find('.xy-chips-input-field');
    await input.setValue('XiaoyeUI');
    await input.trigger('keydown', { code: 'Enter' });

    await asyncExpect(() => {
      expect(wrapper.emitted('update:value')).toBeTruthy();
      expect(wrapper.emitted('update:value')[0]).toEqual([['XiaoyeUI']]);
      expect(wrapper.emitted('add')).toBeTruthy();
    });
  });

  it('should remove chip when clicking remove button', async () => {
    const wrapper = mount(Chips, {
      props: {
        value: ['foo', 'bar'],
      },
    });

    const removeButtons = wrapper.findAll('.xy-chips-item-remove');
    expect(removeButtons.length).toBe(2);

    await removeButtons[0].trigger('click');

    await asyncExpect(() => {
      expect(wrapper.emitted('update:value')).toBeTruthy();
      expect(wrapper.emitted('update:value')[0]).toEqual([['bar']]);
      expect(wrapper.emitted('remove')).toBeTruthy();
      expect(wrapper.emitted('remove')[0][0].value).toBe('foo');
    });
  });

  it('should respect max limit', async () => {
    const wrapper = mount(Chips, {
      props: {
        value: ['foo', 'bar'],
        max: 2,
      },
    });

    const input = wrapper.find('.xy-chips-input-field');
    expect(input.attributes('disabled')).toBeDefined();

    await input.setValue('baz');
    await input.trigger('keydown', { code: 'Enter' });

    await asyncExpect(() => {
      expect(wrapper.emitted('update:value')).toBeFalsy();
    });
  });

  it('should prevent duplicates when allowDuplicate is false', async () => {
    const wrapper = mount(Chips, {
      props: {
        value: ['foo'],
        allowDuplicate: false,
      },
    });

    const input = wrapper.find('.xy-chips-input-field');
    await input.setValue('foo');
    await input.trigger('keydown', { code: 'Enter' });

    await asyncExpect(() => {
      expect(wrapper.emitted('update:value')).toBeFalsy();
    });
  });

  it('should allow duplicates by default', async () => {
    const wrapper = mount(Chips, {
      props: {
        value: ['foo'],
      },
    });

    const input = wrapper.find('.xy-chips-input-field');
    await input.setValue('foo');
    await input.trigger('keydown', { code: 'Enter' });

    await asyncExpect(() => {
      expect(wrapper.emitted('update:value')).toBeTruthy();
      expect(wrapper.emitted('update:value')[0]).toEqual([['foo', 'foo']]);
    });
  });
});
