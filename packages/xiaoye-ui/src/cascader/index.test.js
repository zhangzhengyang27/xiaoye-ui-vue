import { asyncExpect } from '../../tests/utils';
import { mount } from '@vue/test-utils';
import KeyCode from './../_util/KeyCode';
import Cascader from '.';
import focusTest from '../../tests/shared/focusTest';

function $$(className) {
  return document.body.querySelectorAll(className);
}
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

function filter(inputValue, path) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

function toggleOpen(wrapper) {
  wrapper.find('.xy-select-selector').trigger('mousedown');
}

function isOpen(wrapper) {
  return !!wrapper.findComponent({ name: 'Trigger' }).props().popupVisible;
}

describe('Cascader', () => {
  focusTest(Cascader);
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('popup correctly when panel is hidden', async () => {
    mount(Cascader, {
      props: { options },
      sync: false,
      attachTo: 'body',
    });
    await asyncExpect(() => {
      expect($$('.xy-cascader-menus').length).toBe(0);
    });
  });

  it('popup correctly when panel is open', async () => {
    const wrapper = mount(Cascader, { props: { options }, sync: false, attachTo: 'body' });
    await asyncExpect(() => {
      toggleOpen(wrapper);
    });
    expect($$('.xy-cascader-menus').length).toBe(1);
    await asyncExpect(() => {
    }, 1000);
  });

  it('support controlled mode', async () => {
    const wrapper = mount(Cascader, { props: { options }, sync: false });
    await asyncExpect(() => {
      wrapper.setProps({
        value: ['zhejiang', 'hangzhou', 'xihu'],
      });
    });
    await asyncExpect(() => {
    });
  });

  it('popup correctly with defaultValue', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        defaultValue: ['zhejiang', 'hangzhou'],
      },
      sync: false,
    });

    await asyncExpect(() => {
      toggleOpen(wrapper);
    });
    expect($$('.xy-cascader-menus').length).toBe(1);
    await asyncExpect(() => {
    }, 0);
  });

  it('can be selected', async () => {
    const wrapper = mount(Cascader, { props: { options }, sync: false });
    await asyncExpect(() => {
      toggleOpen(wrapper);
    });
    await asyncExpect(() => {
      $$('.xy-cascader-menu')[0].querySelectorAll('.xy-cascader-menu-item')[0].click();
    });

    await asyncExpect(() => {
    });

    await asyncExpect(() => {
      $$('.xy-cascader-menu')[1].querySelectorAll('.xy-cascader-menu-item')[0].click();
    });

    await asyncExpect(() => {
    });

    await asyncExpect(() => {
      $$('.xy-cascader-menu')[2].querySelectorAll('.xy-cascader-menu-item')[0].click();
    });

    await asyncExpect(() => {
    });
  });

  it('backspace should work with `Cascader[showSearch]`', async () => {
    const wrapper = mount(Cascader, { props: { options, showSearch: true }, sync: false });
    await asyncExpect(() => {
      wrapper.find('input').element.value = '123';
      wrapper.find('input').trigger('input');
    });
    await asyncExpect(() => {
      expect(isOpen(wrapper)).toBeTruthy();
    });
    await asyncExpect(() => {
      wrapper.find('input').element.keyCode = KeyCode.BACKSPACE;
      wrapper.find('input').trigger('keydown');
    });
    await asyncExpect(() => {
      expect(isOpen(wrapper)).toBeTruthy();
    });
    await asyncExpect(() => {
      wrapper.find('input').element.value = '';
      wrapper.find('input').trigger('input');
    });
    await asyncExpect(() => {
      expect(isOpen(wrapper)).toBeTruthy();
    });
    // await asyncExpect(() => {
    //   wrapper.find('input').element.keyCode = KeyCode.BACKSPACE;
    //   wrapper.find('input').trigger('keydown');
    // });
    // await asyncExpect(() => {
    //   expect(isOpen(wrapper)).toBeFalsy();
    // }, 0);
  });

  describe('limit filtered item count', () => {
    beforeEach(() => {
      document.body.outerHTML = '';
    });

    afterEach(() => {
      document.body.outerHTML = '';
    });

    it('limit with positive number', async () => {
      const wrapper = mount(Cascader, {
        props: { options, showSearch: { filter, limit: 1 } },
        sync: false,
        attachTo: 'body',
      });
      wrapper.find('input').trigger('click');
      wrapper.find('input').element.value = 'a';
      wrapper.find('input').trigger('input');
      await asyncExpect(() => {
        expect($$('.xy-cascader-menu-item').length).toBe(1);
      }, 0);
    });

    it('not limit', async () => {
      const wrapper = mount(Cascader, {
        props: { options, showSearch: { filter, limit: false } },
        sync: false,
        attachTo: 'body',
      });
      wrapper.find('input').trigger('click');
      wrapper.find('input').element.value = 'a';
      wrapper.find('input').trigger('input');
      await asyncExpect(() => {
        expect($$('.xy-cascader-menu-item').length).toBe(2);
      }, 0);
    });

    it('negative limit', async () => {
      const wrapper = mount(Cascader, {
        props: { options, showSearch: { filter, limit: -1 } },
        sync: false,
        attachTo: 'body',
      });
      wrapper.find('input').trigger('click');
      wrapper.find('input').element.value = 'a';
      wrapper.find('input').trigger('input');
      await asyncExpect(() => {
        expect($$('.xy-cascader-menu-item').length).toBe(2);
      }, 0);
    });
  });
});
