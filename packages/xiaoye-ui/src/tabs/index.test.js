import { mount } from '@vue/test-utils';
import Tabs, { TabPane } from '.';

describe('Tabs', () => {
  describe('editable-card', () => {
    let handleEdit;
    let wrapper;

    beforeEach(() => {
      handleEdit = vi.fn();
      wrapper = mount({
        render() {
          return (
            <Tabs type="editable-card" onEdit={handleEdit}>
              <TabPane tab="foo" key="1">
                foo
              </TabPane>
            </Tabs>
          );
        },
      });
    });

    it('add card', () => {
      wrapper.find('.xy-tabs-nav-add').trigger('click');
      expect(handleEdit.mock.calls[0][1]).toBe('add');
    });

    it('remove card', () => {
      wrapper.find('.xy-tabs-tab-remove').trigger('click');
      expect(handleEdit).toBeCalledWith('1', 'remove');
    });
  });

  describe('tabPosition', () => {
    it('remove card', () => {
      mount({
        render() {
          return (
            <Tabs tabPosition="left" v-slots={{ rightExtra: () => 'xxx' }}>
              <TabPane tab="foo" key="1">
                foo
              </TabPane>
            </Tabs>
          );
        },
      });
    });
  });
});
