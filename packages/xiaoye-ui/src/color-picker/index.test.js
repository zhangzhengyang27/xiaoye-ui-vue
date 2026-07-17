import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ColorPicker from '.';
import mountTest from '../../tests/shared/mountTest';

describe('ColorPicker', () => {
  mountTest(ColorPicker);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks with __XY_COLOR_PICKER flag', () => {
    expect(ColorPicker.__XY_COLOR_PICKER).toBe(true);
  });

  it('has install function', () => {
    expect(typeof ColorPicker.install).toBe('function');
  });

  it('renders colorpicker container with modelValue', () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ff0000' },
      attachTo: 'body',
    });
    expect(document.body.querySelector('.xy-colorpicker')).not.toBeNull();
    wrapper.unmount();
  });

  it('renders preview input in non-inline mode', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: false, modelValue: '#ff0000' },
      attachTo: 'body',
    });
    expect(document.body.querySelector('.xy-colorpicker-preview')).not.toBeNull();
    wrapper.unmount();
  });

  it('renders inline panel when inline is true', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true },
      attachTo: 'body',
    });
    const container = document.body.querySelector('.xy-colorpicker');
    expect(container).not.toBeNull();
    expect(container.classList.contains('xy-colorpicker-inline')).toBe(true);
    expect(document.body.querySelector('.xy-colorpicker-panel')).not.toBeNull();
    wrapper.unmount();
  });

  it('does not render preview input in inline mode', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true },
      attachTo: 'body',
    });
    expect(document.body.querySelector('.xy-colorpicker-preview')).toBeNull();
    wrapper.unmount();
  });

  it('applies disabled class when disabled is true', () => {
    const wrapper = mount(ColorPicker, {
      props: { disabled: true, modelValue: '#ff0000' },
      attachTo: 'body',
    });
    const container = document.body.querySelector('.xy-colorpicker');
    expect(container.classList.contains('xy-colorpicker-disabled')).toBe(true);
    wrapper.unmount();
  });

  it('renders color selector and hue in inline mode', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true },
      attachTo: 'body',
    });
    expect(document.body.querySelector('.xy-colorpicker-color-selector')).not.toBeNull();
    expect(document.body.querySelector('.xy-colorpicker-color-background')).not.toBeNull();
    expect(document.body.querySelector('.xy-colorpicker-color-handle')).not.toBeNull();
    expect(document.body.querySelector('.xy-colorpicker-hue')).not.toBeNull();
    expect(document.body.querySelector('.xy-colorpicker-hue-handle')).not.toBeNull();
    wrapper.unmount();
  });

  it('exposes key methods', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true },
      attachTo: 'body',
    });
    expect(typeof wrapper.vm.onInputClick).toBe('function');
    expect(typeof wrapper.vm.onColorMousedown).toBe('function');
    expect(typeof wrapper.vm.onHueMousedown).toBe('function');
    expect(typeof wrapper.vm.pickColor).toBe('function');
    expect(typeof wrapper.vm.pickHue).toBe('function');
    expect(typeof wrapper.vm.updateUI).toBe('function');
    expect(typeof wrapper.vm.writeValue).toBe('function');
    expect(wrapper.vm.overlayVisible).toBe(false);
    wrapper.unmount();
  });

  it('toggles overlay visibility on input click', () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ff0000' },
      attachTo: 'body',
    });
    expect(wrapper.vm.overlayVisible).toBe(false);
    wrapper.vm.onInputClick();
    expect(wrapper.vm.overlayVisible).toBe(true);
    wrapper.vm.onInputClick();
    expect(wrapper.vm.overlayVisible).toBe(false);
    wrapper.unmount();
  });

  it('does not toggle overlay when disabled', () => {
    const wrapper = mount(ColorPicker, {
      props: { disabled: true, modelValue: '#ff0000' },
      attachTo: 'body',
    });
    expect(wrapper.vm.overlayVisible).toBe(false);
    wrapper.vm.onInputClick();
    expect(wrapper.vm.overlayVisible).toBe(false);
    wrapper.unmount();
  });

  it('emits update:modelValue and value-change on writeValue', async () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true, modelValue: 'ff0000' },
      attachTo: 'body',
    });
    const fakeEvent = { preventDefault: () => {} };
    wrapper.vm.writeValue('00ff00', fakeEvent);
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const updateEvents = wrapper.emitted('update:modelValue');
    expect(updateEvents[updateEvents.length - 1][0]).toBe('00ff00');
    expect(wrapper.emitted('value-change')).toBeTruthy();
    const valueChangeEvents = wrapper.emitted('value-change');
    expect(valueChangeEvents[valueChangeEvents.length - 1][0]).toBe('00ff00');
    expect(wrapper.vm.d_value).toBe('00ff00');
    wrapper.unmount();
  });

  it('initializes hsbValue from modelValue', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true, modelValue: '#ff0000', format: 'hex' },
      attachTo: 'body',
    });
    expect(wrapper.vm.hsbValue).not.toBeNull();
    // #ff0000 -> HSB(0, 100, 100)
    expect(wrapper.vm.hsbValue.h).toBe(0);
    expect(wrapper.vm.hsbValue.s).toBe(100);
    expect(wrapper.vm.hsbValue.b).toBe(100);
    wrapper.unmount();
  });

  it('uses defaultColor when modelValue is not provided', () => {
    const wrapper = mount(ColorPicker, {
      props: { inline: true, defaultColor: '00ff00' },
      attachTo: 'body',
    });
    expect(wrapper.vm.hsbValue).not.toBeNull();
    // #00ff00 -> HSB(120, 100, 100)
    expect(wrapper.vm.hsbValue.h).toBe(120);
    expect(wrapper.vm.hsbValue.s).toBe(100);
    expect(wrapper.vm.hsbValue.b).toBe(100);
    wrapper.unmount();
  });
});
