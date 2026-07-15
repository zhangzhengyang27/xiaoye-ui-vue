import { defineComponent } from 'vue';
import { List, ListItem, ListItemMeta, Avatar } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const data = [
  { title: 'Xiaoye UI Title 1' },
  { title: 'Xiaoye UI Title 2' },
  { title: 'Xiaoye UI Title 3' },
  { title: 'Xiaoye UI Title 4' },
];
const Demo = defineComponent({
  setup() {
    return () => (
      <List
        itemLayout="horizontal"
        dataSource={data}
        v-slots={{
          renderItem: ({ item }: any) => (
            <ListItem>
              <ListItemMeta
                v-slots={{
                  avatar: () => <Avatar src="https://joeschmoe.io/api/v1/random" />,
                  title: () => <a href="#">{item.title}</a>,
                }}
                description="Xiaoye UI, a design language for background applications, is refined by Xiaoye UI Team"
              />
            </ListItem>
          ),
        }}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [],
  key: 'default',
};

export default componentDemo;
