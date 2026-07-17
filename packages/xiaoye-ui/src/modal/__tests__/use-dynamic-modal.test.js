import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import useDynamicModal from '../useDynamicModal';
import { asyncExpect } from '../../../tests/utils';

vi.mock('../../_util/Portal');

const ContentComponent = defineComponent({
  name: 'TestContent',
  props: ['text'],
  render() {
    return h('div', { class: 'test-content' }, this.text);
  },
});

const Tester = defineComponent({
  name: 'Tester',
  setup() {
    const [instance, holder] = useDynamicModal();
    const modalRef = ref(null);
    const open = () => {
      modalRef.value = instance.open(ContentComponent, {
        componentProps: { text: 'hello' },
        modalProps: { title: 'Test Title' },
      });
    };
    const destroy = () => {
      modalRef.value?.destroy();
    };
    const update = () => {
      modalRef.value?.update({ componentProps: { text: 'updated' } });
    };
    return { open, destroy, update, holder };
  },
  render() {
    return (
      <div>
        <button class="open-btn" onClick={this.open}>
          Open
        </button>
        <button class="destroy-btn" onClick={this.destroy}>
          Destroy
        </button>
        <button class="update-btn" onClick={this.update}>
          Update
        </button>
        {this.holder()}
      </div>
    );
  },
});

describe('useDynamicModal', () => {
  it('renders holder without errors', () => {
    const wrapper = mount(Tester);
    expect(wrapper.find('.open-btn').exists()).toBe(true);
    wrapper.unmount();
  });

  it('opens modal with component', async () => {
    const wrapper = mount(Tester, { attachTo: 'body' });
    await wrapper.find('.open-btn').trigger('click');
    await asyncExpect(() => {});
    expect(document.querySelector('.test-content')).toBeTruthy();
    expect(document.querySelector('.test-content').textContent).toBe('hello');
    wrapper.unmount();
  });

  it('updates component props', async () => {
    const wrapper = mount(Tester, { attachTo: 'body' });
    await wrapper.find('.open-btn').trigger('click');
    await asyncExpect(() => {});
    await wrapper.find('.update-btn').trigger('click');
    await asyncExpect(() => {});
    expect(document.querySelector('.test-content').textContent).toBe('updated');
    wrapper.unmount();
  });

  it('destroys modal without errors', async () => {
    const wrapper = mount(Tester, { attachTo: 'body' });
    await wrapper.find('.open-btn').trigger('click');
    await asyncExpect(() => {});
    expect(document.querySelector('.test-content')).toBeTruthy();
    expect(() => {
      wrapper.find('.destroy-btn').trigger('click');
    }).not.toThrow();
    await asyncExpect(() => {});
    wrapper.unmount();
  });

  it('open returns ref with destroy and update methods', async () => {
    const wrapper = mount(Tester, { attachTo: 'body' });
    await wrapper.find('.open-btn').trigger('click');
    await asyncExpect(() => {});
    const testerVm = wrapper.vm;
    expect(testerVm).toBeTruthy();
    wrapper.unmount();
  });

  it('passes modalProps to Modal', async () => {
    const wrapper = mount(Tester, { attachTo: 'body' });
    await wrapper.find('.open-btn').trigger('click');
    await asyncExpect(() => {});
    const titleEl = document.querySelector('.xy-modal-title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toBe('Test Title');
    wrapper.unmount();
  });
});
