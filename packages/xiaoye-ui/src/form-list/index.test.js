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
});
