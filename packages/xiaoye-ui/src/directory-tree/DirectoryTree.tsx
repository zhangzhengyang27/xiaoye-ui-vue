import type { ExtractPropTypes } from 'vue';
import { nextTick, onUpdated, ref, watch, defineComponent, computed } from 'vue';
import debounce from 'lodash-es/debounce';
import { FolderOpenOutlined, FolderOutlined, FileOutlined } from '@xiaoye-ui/icons';
import classNames from '../_util/classNames';
import type { XyTreeNodeAttribute, TreeProps } from '../tree/Tree';
import Tree, { treeProps } from '../tree/Tree';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import {
  convertDataToEntities,
  convertTreeToData,
  fillFieldNames,
} from '../vc-tree/utils/treeUtil';
import type { DataNode, EventDataNode, Key, ScrollTo } from '../vc-tree/interface';
import { conductExpandParent } from '../vc-tree/util';
import { calcRangeKeys, convertDirectoryKeysToNodes } from '../tree/utils/dictUtil';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { filterEmpty } from '../_util/props-util';
import { someType } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';

// CSS-in-JS
import useStyle from './style';

// 目录树展开触发动作
export type ExpandAction = false | 'click' | 'doubleclick' | 'dblclick';

export const directoryTreeProps = () => ({
  ...treeProps(),
  expandAction: someType<ExpandAction>([Boolean, String]),
});

export type DirectoryTreeProps = Partial<ExtractPropTypes<ReturnType<typeof directoryTreeProps>>>;

// 根据节点状态返回文件夹/文件图标
function getIcon(props: XyTreeNodeAttribute) {
  const { isLeaf, expanded } = props;
  if (isLeaf) {
    return <FileOutlined />;
  }
  return expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYDirectoryTree',
  inheritAttrs: false,
  __XY_DIRECTORY_TREE: true,
  props: initDefaultProps(directoryTreeProps(), {
    showIcon: true,
    expandAction: 'click',
  }),
  slots: Object as CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    titleRender?: any;
    default?: any;
  }>,
  setup(props, { attrs, slots, emit, expose }) {
    // convertTreeToData 兼容 xy-tree-node 历史写法
    const treeData = ref<DataNode[]>(
      props.treeData || convertTreeToData(filterEmpty(slots.default?.())),
    );

    watch(
      () => props.treeData,
      () => {
        treeData.value = props.treeData;
      },
    );
    onUpdated(() => {
      nextTick(() => {
        if (props.treeData === undefined && slots.default) {
          treeData.value = convertTreeToData(filterEmpty(slots.default?.()));
        }
      });
    });

    // Shift 多选时记录上次选中节点
    const lastSelectedKey = ref<Key>();
    const cachedSelectedKeys = ref<Key[]>();
    const fieldNames = computed(() => fillFieldNames(props.fieldNames));
    const treeRef = ref();
    const scrollTo: ScrollTo = scroll => {
      treeRef.value?.scrollTo(scroll);
    };
    expose({
      scrollTo,
      selectedKeys: computed(() => treeRef.value?.selectedKeys),
      checkedKeys: computed(() => treeRef.value?.checkedKeys),
      halfCheckedKeys: computed(() => treeRef.value?.halfCheckedKeys),
      loadedKeys: computed(() => treeRef.value?.loadedKeys),
      loadingKeys: computed(() => treeRef.value?.loadingKeys),
      expandedKeys: computed(() => treeRef.value?.expandedKeys),
    });

    // 计算初始展开的节点
    const getInitExpandedKeys = () => {
      const { keyEntities } = convertDataToEntities(treeData.value, {
        fieldNames: fieldNames.value,
      });

      let initExpandedKeys: any;
      if (props.defaultExpandAll) {
        // 默认展开全部
        initExpandedKeys = Object.keys(keyEntities);
      } else if (props.defaultExpandParent) {
        // 默认展开父节点
        initExpandedKeys = conductExpandParent(
          props.expandedKeys || props.defaultExpandedKeys || [],
          keyEntities,
        );
      } else {
        initExpandedKeys = props.expandedKeys || props.defaultExpandedKeys;
      }
      return initExpandedKeys;
    };

    const selectedKeys = ref(props.selectedKeys || props.defaultSelectedKeys || []);
    const expandedKeys = ref<Key[]>(getInitExpandedKeys());

    watch(
      () => props.selectedKeys,
      () => {
        if (props.selectedKeys !== undefined) {
          selectedKeys.value = props.selectedKeys;
        }
      },
      { immediate: true },
    );

    watch(
      () => props.expandedKeys,
      () => {
        if (props.expandedKeys !== undefined) {
          expandedKeys.value = props.expandedKeys;
        }
      },
      { immediate: true },
    );

    // 点击文件夹节点时展开/收起
    const expandFolderNode = (event: MouseEvent, node: any) => {
      const { isLeaf } = node;
      // 叶子节点或配合修饰键时跳过
      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }
      treeRef.value!.onNodeExpand(event as any, node);
    };
    const onDebounceExpand = debounce(expandFolderNode, 200, {
      leading: true,
    });

    const onExpand = (
      keys: Key[],
      info: {
        node: EventDataNode;
        expanded: boolean;
        nativeEvent: MouseEvent;
      },
    ) => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
      emit('update:expandedKeys', keys);
      emit('expand', keys, info);
    };

    const onClick = (event: MouseEvent, node: EventDataNode) => {
      const { expandAction } = props;
      if (expandAction === 'click') {
        onDebounceExpand(event, node);
      }
      emit('click', event, node);
    };

    const onDoubleClick = (event: MouseEvent, node: EventDataNode) => {
      const { expandAction } = props;
      if (expandAction === 'dblclick' || expandAction === 'doubleclick') {
        onDebounceExpand(event, node);
      }
      emit('doubleclick', event, node);
      emit('dblclick', event, node);
    };

    // 目录树选中逻辑：支持 ctrl(Windows)/command(Mac) 多选与 shift 范围选择
    const onSelect = (
      keys: Key[],
      event: {
        event: 'select';
        selected: boolean;
        node: any;
        selectedNodes: DataNode[];
        nativeEvent: MouseEvent;
      },
    ) => {
      const { multiple } = props;
      const { node, nativeEvent } = event;
      const key = node[fieldNames.value.key];

      const newEvent: any = {
        ...event,
        selected: true, // 目录树选中始终为 true
      };

      const ctrlPick: boolean = nativeEvent?.ctrlKey || nativeEvent?.metaKey;
      const shiftPick: boolean = nativeEvent?.shiftKey;

      let newSelectedKeys: Key[];
      if (multiple && ctrlPick) {
        // ctrl/command 点击：追加选中
        newSelectedKeys = keys;
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(
          treeData.value,
          newSelectedKeys,
          fieldNames.value,
        );
      } else if (multiple && shiftPick) {
        // shift 点击：范围选中
        newSelectedKeys = Array.from(
          new Set([
            ...(cachedSelectedKeys.value || []),
            ...calcRangeKeys({
              treeData: treeData.value,
              expandedKeys: expandedKeys.value,
              startKey: key,
              endKey: lastSelectedKey.value,
              fieldNames: fieldNames.value,
            }),
          ]),
        );
        newEvent.selectedNodes = convertDirectoryKeysToNodes(
          treeData.value,
          newSelectedKeys,
          fieldNames.value,
        );
      } else {
        // 单击：单选
        newSelectedKeys = [key];
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(
          treeData.value,
          newSelectedKeys,
          fieldNames.value,
        );
      }

      emit('update:selectedKeys', newSelectedKeys);
      emit('select', newSelectedKeys, newEvent);
      if (props.selectedKeys === undefined) {
        selectedKeys.value = newSelectedKeys;
      }
    };

    const onCheck: TreeProps['onCheck'] = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };

    const { prefixCls, direction } = useConfigInject('directory-tree', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () => {
      const connectClassName = classNames(
        `${prefixCls.value}-directory`,
        {
          [`${prefixCls.value}-directory-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
        hashId.value,
      );
      const { icon = slots.icon, blockNode = true, ...otherProps } = props;
      return wrapSSR(
        <Tree
          {...attrs}
          {...otherProps}
          icon={icon || getIcon}
          ref={treeRef}
          blockNode={blockNode}
          prefixCls={prefixCls.value}
          class={connectClassName}
          expandedKeys={expandedKeys.value}
          selectedKeys={selectedKeys.value}
          onSelect={onSelect}
          onClick={onClick}
          onDblclick={onDoubleClick}
          onExpand={onExpand}
          onCheck={onCheck}
          v-slots={slots}
        />,
      );
    };
  },
});
