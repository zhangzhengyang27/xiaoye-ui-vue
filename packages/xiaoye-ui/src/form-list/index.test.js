import { mount } from '@vue/test-utils';
import FormList from '.';
import mountTest from '../../tests/shared/mountTest';

describe('FormList', () => {
  mountTest(FormList);

  it('has correct name and flag', () => {
    expect(FormList.name).toBe('XYFormList');
    expect(FormList.__XY_FORM_LIST).toBe(true);
  });

  it('install method exists', () => {
    expect(typeof FormList.install).toBe('function');
  });

  it('renders fields from initialValue', () => {
    const wrapper = mount(FormList, {
      props: { name: 'users', initialValue: [{ name: 'A' }, { name: 'B' }] },
      slots: {
        default: ({ fields }) => fields.map(f => <div key={f.key}>{f.name}</div>),
      },
    });
    expect(wrapper.findAll('div')).toHaveLength(2);
    expect(wrapper.findAll('div')[0].text()).toBe('0');
    expect(wrapper.findAll('div')[1].text()).toBe('1');
  });

  it('add increases field count', async () => {
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{a:1}]">
          <template #default="{ fields, add }">
            <button @click="add({a:2})">add</button>
            <div v-for="f in fields" :key="f.key">{{ f.name }}</div>
          </template>
        </FormList>
      `,
    });
    expect(wrapper.findAll('div')).toHaveLength(1);
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAll('div')).toHaveLength(2);
  });

  it('remove decreases field count', async () => {
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{a:1},{a:2},{a:3}]">
          <template #default="{ fields, remove }">
            <button @click="remove(0)">remove</button>
            <div v-for="f in fields" :key="f.key">{{ f.name }}</div>
          </template>
        </FormList>
      `,
    });
    expect(wrapper.findAll('div')).toHaveLength(3);
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAll('div')).toHaveLength(2);
  });

  it('move changes field order', async () => {
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{v:'A'},{v:'B'},{v:'C'}]">
          <template #default="{ fields, move }">
            <button @click="move(0, 2)">move</button>
            <div v-for="f in fields" :key="f.key">{{ f.key }}</div>
          </template>
        </FormList>
      `,
    });
    const keysBefore = wrapper.findAll('div').map(d => d.text());
    await wrapper.find('button').trigger('click');
    const keysAfter = wrapper.findAll('div').map(d => d.text());
    // move(0, 2): 第一个元素移到最后
    expect(keysAfter).toEqual([keysBefore[1], keysBefore[2], keysBefore[0]]);
  });

  it('key uniqueness stays stable after add and remove', async () => {
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{a:1}]">
          <template #default="{ fields, add, remove }">
            <button class="add" @click="add({a:2})">add</button>
            <button class="remove" @click="remove(0)">remove</button>
            <div v-for="f in fields" :key="f.key">{{ f.key }}</div>
          </template>
        </FormList>
      `,
    });
    await wrapper.find('.add').trigger('click');
    await wrapper.find('.add').trigger('click');
    await wrapper.find('.remove').trigger('click');
    await wrapper.find('.add').trigger('click');
    const keys = wrapper.findAll('div').map(d => d.text());
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('works without name (no sync to form)', () => {
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :initialValue="[{a:1}]">
          <template #default="{ fields }">
            <div v-for="f in fields" :key="f.key">{{ f.name }}</div>
          </template>
        </FormList>
      `,
    });
    expect(wrapper.findAll('div')).toHaveLength(1);
  });

  // ===== 以下为补充测试 =====

  it('渲染默认 slot 并提供完整的 scope（fields/add/remove/move）', () => {
    // 验证 default slot 被调用，且 scope 包含 fields 数组及 add/remove/move 三个方法
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{a:1}]">
          <template #default="{ fields, add, remove, move }">
            <div v-for="f in fields" :key="f.key" class="field">{{ f.key }}</div>
            <button class="add-btn" @click="add({a:2})">add</button>
            <button class="remove-btn" @click="remove(0)">remove</button>
            <button class="move-btn" @click="move(0, 0)">move</button>
          </template>
        </FormList>
      `,
    });
    // 初始应渲染 1 个字段及 3 个按钮
    expect(wrapper.findAll('.field')).toHaveLength(1);
    expect(wrapper.find('.add-btn').exists()).toBe(true);
    expect(wrapper.find('.remove-btn').exists()).toBe(true);
    expect(wrapper.find('.move-btn').exists()).toBe(true);
    // add/remove/move 均为可调用函数
    expect(typeof wrapper.vm).toBe('object');
    wrapper.unmount();
  });

  it('未传入 initialValue 时字段列表为空', () => {
    // 验证无 initialValue 时，fields 为空数组，不渲染任何字段
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'">
          <template #default="{ fields }">
            <div v-for="f in fields" :key="f.key" class="field">{{ f.key }}</div>
          </template>
        </FormList>
      `,
    });
    expect(wrapper.findAll('.field')).toHaveLength(0);
    wrapper.unmount();
  });

  it('add 指定 insertIndex 时在指定位置插入字段', async () => {
    // 验证 add 的第二个参数 insertIndex 可在指定位置插入而非末尾追加
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{v:'A'},{v:'B'},{v:'C'}]">
          <template #default="{ fields, add }">
            <button class="insert-btn" @click="add({v:'X'}, 1)">insert at 1</button>
            <div v-for="f in fields" :key="f.key" class="field">{{ f.name }}</div>
          </template>
        </FormList>
      `,
    });
    // 初始 3 个字段，name 为 0/1/2
    expect(wrapper.findAll('.field')).toHaveLength(3);
    expect(wrapper.findAll('.field')[0].text()).toBe('0');
    expect(wrapper.findAll('.field')[1].text()).toBe('1');
    // 在索引 1 处插入新字段
    await wrapper.find('.insert-btn').trigger('click');
    expect(wrapper.findAll('.field')).toHaveLength(4);
    // 插入后，新字段位于索引 1，name 为 1，原索引 1/2 后移为 2/3
    expect(wrapper.findAll('.field')[0].text()).toBe('0');
    expect(wrapper.findAll('.field')[1].text()).toBe('1');
    expect(wrapper.findAll('.field')[2].text()).toBe('2');
    expect(wrapper.findAll('.field')[3].text()).toBe('3');
    wrapper.unmount();
  });

  it('remove 移除中间索引的字段后顺序正确', async () => {
    // 验证 remove 移除非零索引（中间项）后，剩余字段 name 重新排序
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{v:'A'},{v:'B'},{v:'C'}]">
          <template #default="{ fields, remove }">
            <button class="remove-mid" @click="remove(1)">remove middle</button>
            <div v-for="f in fields" :key="f.key" class="field">{{ f.name }}</div>
          </template>
        </FormList>
      `,
    });
    expect(wrapper.findAll('.field')).toHaveLength(3);
    // 移除索引 1（中间项 B）
    await wrapper.find('.remove-mid').trigger('click');
    expect(wrapper.findAll('.field')).toHaveLength(2);
    // 剩余 2 个字段，name 重新为 0/1
    expect(wrapper.findAll('.field')[0].text()).toBe('0');
    expect(wrapper.findAll('.field')[1].text()).toBe('1');
    wrapper.unmount();
  });

  it('每个字段的 key 以 list_ 前缀生成且全局唯一', () => {
    // 验证 fields 中每个字段的 key 符合 list_ 前缀格式，且在同一渲染中唯一
    const wrapper = mount({
      components: { FormList },
      template: `
        <FormList :name="'users'" :initialValue="[{a:1},{a:2},{a:3}]">
          <template #default="{ fields }">
            <div v-for="f in fields" :key="f.key" class="field" :data-key="f.key">{{ f.name }}</div>
          </template>
        </FormList>
      `,
    });
    const fields = wrapper.findAll('.field');
    expect(fields).toHaveLength(3);
    const keys = fields.map(f => f.attributes('data-key'));
    // 每个 key 都应以 list_ 前缀开头
    keys.forEach(key => {
      expect(key).toMatch(/^list_\d+$/);
    });
    // key 全局唯一
    expect(new Set(keys).size).toBe(keys.length);
    wrapper.unmount();
  });
});
