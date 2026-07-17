/// <reference types="vue/jsx" />
import { computed, defineComponent, onMounted, onUpdated, ref, watch } from 'vue';
import { getOuterWidth } from '@xiaoye-ui/utils/dom';
import { resolveFieldData } from '@xiaoye-ui/utils/object';
import { getVNodeProp } from '@xiaoye-ui/core/utils';
import { ChevronDownIcon, ChevronRightIcon, SpinnerIcon } from '@xiaoye-ui/icons';
import Checkbox from 'xiaoye-ui/checkbox';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import { bodyCellProps } from './treeTableTypes';

// SSR 安全：仅在有 document 的环境下执行 DOM 查询
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYBodyCell',
  inheritAttrs: false,
  props: initDefaultProps(bodyCellProps(), {}),
  emits: ['nodeToggle', 'checkboxToggle'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('tree-table', props);

    const styleObject = ref<Record<string, string>>({});

    const checkboxValue = ref(props.checked);
    watch(
      () => props.checked,
      val => {
        checkboxValue.value = val;
      },
    );

    function columnProp(prop: string) {
      // 修复：使用 getVNodeProp 正确处理 boolean 类型属性（如 expander/frozen）
      return getVNodeProp(props.column, prop);
    }

    expose({ columnProp });

    onMounted(() => {
      if (columnProp('frozen')) {
        updateStickyPosition();
      }
    });

    onUpdated(() => {
      if (columnProp('frozen')) {
        updateStickyPosition();
      }
    });

    function updateStickyPosition() {
      if (!isClient) return;
      if (columnProp('frozen')) {
        const align = columnProp('alignFrozen');

        if (align === 'right') {
          let pos = 0;
          let next: HTMLElement | null = null;

          const allTds = document.querySelectorAll('td[data-xy-frozen-column="true"]');
          for (let i = 0; i < allTds.length; i++) {
            const td = allTds[i] as HTMLElement;
            if (td.style.insetInlineEnd) {
              next = td;
              break;
            }
          }

          if (next) {
            pos = getOuterWidth(next) + parseFloat(next.style['inset-inline-end'] || '0');
          }

          styleObject.value = { ...styleObject.value, insetInlineEnd: pos + 'px' };
        } else {
          let pos = 0;
          let prev: HTMLElement | null = null;

          const allTds = document.querySelectorAll('td[data-xy-frozen-column="true"]');
          for (let i = 0; i < allTds.length; i++) {
            const td = allTds[i] as HTMLElement;
            if (td.style.insetInlineStart) {
              prev = td;
            }
          }

          if (prev) {
            pos = getOuterWidth(prev) + parseFloat(prev.style['inset-inline-start'] || '0');
          }

          styleObject.value = { ...styleObject.value, insetInlineStart: pos + 'px' };
        }
      }
    }

    function toggle() {
      emit('nodeToggle', props.node);
    }

    function toggleCheckbox() {
      emit('checkboxToggle');
    }

    const containerClass = computed(() => {
      return [
        columnProp('bodyClass'),
        columnProp('class'),
        `${prefixCls.value}-cell`,
        {
          [`${prefixCls.value}-cell-frozen`]: columnProp('frozen'),
        },
      ];
    });

    const containerStyle = computed(() => {
      const bodyStyle = columnProp('bodyStyle');
      const columnStyle = columnProp('style');

      return columnProp('frozen')
        ? [columnStyle, bodyStyle, styleObject.value]
        : [columnStyle, bodyStyle];
    });

    const togglerStyle = computed(() => {
      return {
        marginLeft: props.level * props.indentation + 'rem',
        visibility: (props.leaf ? 'hidden' : 'visible') as 'hidden' | 'visible',
      };
    });

    const checkboxSelectionMode = computed(() => {
      return props.selectionMode === 'checkbox';
    });

    return () => {
      const col = props.column;
      const rowToggleIconTpl = col?.children?.rowtoggleicon;
      const rowTogglerIconTpl = col?.children?.rowtogglericon;
      const bodyTpl = col?.children?.body;
      const nodeToggleIconTpl = props.templates?.['nodetoggleicon'];
      const nodeTogglerIconTpl = props.templates?.['nodetogglericon'];
      const checkboxIconTpl = props.templates?.['checkboxicon'];

      let toggleIcon: any = null;
      if (props.node?.loading && props.loadingMode === 'icon') {
        if (nodeTogglerIconTpl) {
          toggleIcon = <nodeTogglerIconTpl />;
        } else {
          toggleIcon = <SpinnerIcon spin class={`${prefixCls.value}-node-toggle-icon`} />;
        }
      } else if (rowToggleIconTpl) {
        toggleIcon = (
          <rowToggleIconTpl
            node={props.node}
            expanded={props.expanded}
            class={`${prefixCls.value}-node-toggle-icon`}
          />
        );
      } else if (nodeToggleIconTpl) {
        toggleIcon = (
          <nodeToggleIconTpl
            node={props.node}
            expanded={props.expanded}
            class={`${prefixCls.value}-node-toggle-icon`}
          />
        );
      } else if (rowTogglerIconTpl) {
        toggleIcon = (
          <rowTogglerIconTpl
            node={props.node}
            expanded={props.expanded}
            class={`${prefixCls.value}-node-toggle-icon`}
          />
        );
      } else if (props.expanded) {
        toggleIcon = props.node?.expandedIcon ? (
          <span class={`${prefixCls.value}-node-toggle-icon`}>{props.node.expandedIcon}</span>
        ) : (
          <ChevronDownIcon class={`${prefixCls.value}-node-toggle-icon`} />
        );
      } else {
        toggleIcon = props.node?.collapsedIcon ? (
          <span class={`${prefixCls.value}-node-toggle-icon`}>{props.node.collapsedIcon}</span>
        ) : (
          <ChevronRightIcon class={`${prefixCls.value}-node-toggle-icon`} />
        );
      }

      return (
        <td
          style={containerStyle.value}
          class={containerClass.value}
          role="cell"
          data-xy-frozen-column={columnProp('frozen')}
        >
          <div class={`${prefixCls.value}-body-cell-content`}>
            {columnProp('expander') ? (
              <button
                type="button"
                class={`${prefixCls.value}-node-toggle-button`}
                onClick={toggle}
                style={togglerStyle.value}
                tabindex="-1"
                data-xy-group-section="rowactionbutton"
              >
                {toggleIcon}
              </button>
            ) : null}
            {checkboxSelectionMode.value && columnProp('expander') ? (
              <Checkbox
                checked={checkboxValue.value}
                onUpdate:checked={(val: boolean) => (checkboxValue.value = val)}
                onChange={toggleCheckbox}
                class={[`${prefixCls.value}-node-checkbox`]}
                disabled={props.node?.selectable === false}
                indeterminate={props.partialChecked}
                data-xy-partialchecked={props.partialChecked}
                v-slots={
                  checkboxIconTpl
                    ? {
                        icon: (slotProps: any) => (
                          <checkboxIconTpl
                            checked={slotProps.checked}
                            partialChecked={props.partialChecked}
                            class={slotProps.class}
                          />
                        ),
                      }
                    : undefined
                }
              />
            ) : null}
            {bodyTpl ? (
              <bodyTpl node={props.node} column={col} />
            ) : (
              <>{resolveFieldData(props.node?.data, columnProp('field'))}</>
            )}
          </div>
        </td>
      );
    };
  },
});
