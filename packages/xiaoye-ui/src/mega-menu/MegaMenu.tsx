import type { VNode } from 'vue';
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { AngleDownIcon, AngleRightIcon } from '@xiaoye-ui/icons';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';
import { safeUrl } from '../_util/safeUrl';
import { megaMenuProps } from './megaMenuTypes';
import type {
  MegaMenuItem,
  MegaMenuSubItem,
  MegaMenuColumnGroup,
  MegaMenuItemClickEvent,
} from './megaMenuTypes';

// 判断列内元素是否为分组（有 items 字段且为非空数组）
function isColumnGroup(node: any): node is MegaMenuColumnGroup {
  return !!node && Array.isArray(node.items) && node.items.length > 0;
}

export default defineComponent({
  name: 'XYMegaMenu',
  inheritAttrs: false,
  __XY_MEGA_MENU: true,
  props: initDefaultProps(megaMenuProps(), {
    orientation: 'horizontal',
  }),
  slots: Object as CustomSlotsType<{
    start?: any;
    end?: any;
    item?: any;
    itemicon?: any;
    submenuicon?: any;
  }>,
  emits: ['itemClick', 'update:activeItem'],
  setup(props, { slots, attrs, emit, expose }) {
    const { prefixCls, direction } = useConfigInject('mega-menu', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 内部激活项 key（非受控模式）
    const internalActive = ref<string>('');
    // 是否由于 hover 触发（用于 hover 展开）
    const hoveredKey = ref<string>('');

    const containerRef = ref<HTMLElement | null>(null);
    let outsideClickListener: ((event: MouseEvent) => void) | null = null;

    // 合并受控与非受控激活项
    const mergedActiveKey = computed(() => {
      // hover 优先（hover 时临时切换显示）
      if (hoveredKey.value) return hoveredKey.value;
      // 受控
      if (props.activeItem !== undefined) return props.activeItem;
      // 非受控
      return internalActive.value;
    });

    const horizontal = computed(() => props.orientation === 'horizontal');
    const vertical = computed(() => props.orientation === 'vertical');

    // 顶级菜单项列表
    const items = computed<MegaMenuItem[]>(() => {
      const model = props.model;
      if (!model) return [];
      return model.map((item, index) => ({
        ...item,
        key: item.key ?? String(index),
      }));
    });

    // 根类名
    const rootClasses = computed(() => [
      prefixCls.value,
      hashId.value,
      {
        [`${prefixCls.value}-horizontal`]: horizontal.value,
        [`${prefixCls.value}-vertical`]: vertical.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-disabled`]: props.disabled,
      },
    ]);

    // 判断顶级项是否有子菜单
    function hasSubmenu(item: MegaMenuItem): boolean {
      return !!item.items && item.items.length > 0;
    }

    // 判断顶级项是否激活
    function isItemActive(item: MegaMenuItem): boolean {
      return mergedActiveKey.value === item.key;
    }

    // 列宽 class（与样式约定：2/3/4/6/12）
    function columnClass(count: number): string {
      let modifier: string;
      switch (count) {
        case 2:
          modifier = '6';
          break;
        case 3:
          modifier = '4';
          break;
        case 4:
          modifier = '3';
          break;
        case 6:
          modifier = '2';
          break;
        default:
          modifier = '12';
          break;
      }
      return `${prefixCls.value}-column ${prefixCls.value}-column-${modifier}`;
    }

    // 设置激活项
    function setActiveKey(key: string) {
      if (props.activeItem === undefined) {
        internalActive.value = key;
      }
      emit('update:activeItem', key);
    }

    // hover 顶级项
    function onItemMouseEnter(item: MegaMenuItem) {
      if (props.disabled || item.disabled) return;
      hoveredKey.value = item.key ?? '';
      if (hasSubmenu(item)) {
        setActiveKey(item.key ?? '');
      }
    }

    // 鼠标离开整个菜单（hover 关闭）
    function onContainerMouseLeave() {
      hoveredKey.value = '';
    }

    // 点击顶级项
    function onRootItemClick(event: Event, item: MegaMenuItem) {
      if (props.disabled || item.disabled) {
        event.preventDefault();
        return;
      }
      if (hasSubmenu(item)) {
        // 有子菜单时切换展开
        if (isItemActive(item)) {
          setActiveKey('');
        } else {
          setActiveKey(item.key ?? '');
        }
      } else {
        // 叶子项触发点击
        triggerItemClick(event, item);
      }
    }

    // 点击子菜单叶子项
    function onSubItemClick(event: Event, parentKey: string, sub: MegaMenuSubItem) {
      if (sub.disabled) {
        event.preventDefault();
        return;
      }
      // 执行 command 回调
      if (typeof sub.command === 'function') {
        sub.command({ item: sub, originalEvent: event });
      }
      triggerItemClick(event, sub, parentKey);
      // 点击叶子项后关闭面板
      setActiveKey('');
    }

    // 触发 onItemClick 事件
    function triggerItemClick(
      event: Event,
      item: MegaMenuItem | MegaMenuSubItem,
      parentKey?: string,
    ) {
      const payload: MegaMenuItemClickEvent = {
        key: item.key ?? parentKey ?? '',
        item,
        originalEvent: event,
      };
      emit('itemClick', payload);
    }

    // 绑定外部点击监听（点击外部关闭面板）
    function bindOutsideClickListener() {
      if (!outsideClickListener && typeof document !== 'undefined') {
        outsideClickListener = (event: MouseEvent) => {
          const target = event.target as Node;
          if (containerRef.value && !containerRef.value.contains(target)) {
            setActiveKey('');
            hoveredKey.value = '';
          }
        };
        document.addEventListener('click', outsideClickListener, true);
      }
    }

    function unbindOutsideClickListener() {
      if (outsideClickListener && typeof document !== 'undefined') {
        document.removeEventListener('click', outsideClickListener, true);
        outsideClickListener = null;
      }
    }

    // 有激活项时绑定外部监听
    watch(
      mergedActiveKey,
      key => {
        if (key) {
          bindOutsideClickListener();
        } else {
          unbindOutsideClickListener();
        }
      },
      { immediate: false },
    );

    onBeforeUnmount(() => {
      unbindOutsideClickListener();
      hoveredKey.value = '';
    });

    // 渲染图标（支持字符串类名、VNode 或渲染函数）
    function renderIcon(icon: any, className?: string): VNode | null {
      if (!icon) return null;
      if (typeof icon === 'string') {
        return <span class={[`${prefixCls.value}-item-icon`, icon]} />;
      }
      // 支持 VNode 或渲染函数
      const content = typeof icon === 'function' ? icon() : icon;
      return <span class={[`${prefixCls.value}-item-icon`, className]}>{content}</span>;
    }

    // 渲染子菜单图标
    function renderSubmenuIcon(active: boolean): VNode {
      if (slots.submenuicon) {
        return <slots.submenuicon active={active} />;
      }
      // 水平方向用向下箭头，垂直方向用向右箭头
      const Icon = horizontal.value ? AngleDownIcon : AngleRightIcon;
      return <Icon class={`${prefixCls.value}-submenu-icon`} />;
    }

    // 渲染顶级项内容
    function renderItemContent(item: MegaMenuItem): VNode {
      // 自定义 item 插槽
      if (slots.item) {
        return (
          <slots.item
            item={item}
            label={item.label}
            hasSubmenu={hasSubmenu(item)}
            active={isItemActive(item)}
          />
        );
      }

      const iconNode = renderIcon(item.icon);
      const submenuIcon = hasSubmenu(item) ? renderSubmenuIcon(isItemActive(item)) : null;

      // 有 url 时渲染为链接，无 url 时省略 href 以符合 CSP 规范（点击由父级 onClick 处理）
      // href 过协议白名单，target 存在时补 noopener 防反向标签劫持
      const linkProps = item.url
        ? {
            href: safeUrl(item.url),
            target: item.target,
            rel: item.target ? 'noopener noreferrer' : undefined,
          }
        : {};

      return (
        <a {...linkProps} class={`${prefixCls.value}-item-link`} tabindex={-1}>
          {iconNode}
          <span class={`${prefixCls.value}-item-label`}>{item.label}</span>
          {submenuIcon}
        </a>
      );
    }

    // 渲染单列子菜单
    function renderColumn(column: any[], columnKey: string, parentKey: string): VNode {
      const children: VNode[] = [];

      column.forEach((node, idx) => {
        if (isColumnGroup(node)) {
          // 分组：渲染标题 + 叶子项列表
          children.push(
            <li
              key={`${columnKey}-g-${idx}`}
              class={`${prefixCls.value}-submenu-label`}
              role="presentation"
            >
              {node.label}
            </li>,
          );
          (node.items || []).forEach((sub, sIdx) => {
            children.push(renderSubItem(sub, `${columnKey}-g-${idx}-${sIdx}`, parentKey));
          });
        } else {
          // 直接是叶子项
          children.push(renderSubItem(node, `${columnKey}-${idx}`, parentKey));
        }
      });

      return <ul class={`${prefixCls.value}-submenu`}>{children}</ul>;
    }

    // 渲染叶子项
    function renderSubItem(sub: MegaMenuSubItem, key: string, parentKey: string): VNode {
      const itemClass = [
        `${prefixCls.value}-item`,
        {
          [`${prefixCls.value}-item-disabled`]: sub.disabled,
        },
      ];

      const iconNode = renderIcon(sub.icon);

      // 有 url 时渲染为链接，无 url 时省略 href 以符合 CSP 规范（点击由父级 onClick 处理）
      const linkProps = sub.url
        ? {
            href: safeUrl(sub.url),
            target: sub.target,
            rel: sub.target ? 'noopener noreferrer' : undefined,
          }
        : {};

      return (
        <li key={key} class={itemClass} role="menuitem" aria-disabled={sub.disabled || undefined}>
          <div
            class={`${prefixCls.value}-item-content`}
            onClick={(e: Event) => onSubItemClick(e, parentKey, sub)}
          >
            <a {...linkProps} class={`${prefixCls.value}-item-link`} tabindex={-1}>
              {iconNode}
              <span class={`${prefixCls.value}-item-label`}>{sub.label}</span>
            </a>
          </div>
        </li>
      );
    }

    // 渲染顶级项
    function renderRootItem(item: MegaMenuItem, index: number): VNode {
      const key = item.key ?? String(index);
      const active = isItemActive(item);
      const grouped = hasSubmenu(item);

      const itemClass = [
        `${prefixCls.value}-item`,
        {
          [`${prefixCls.value}-item-active`]: active,
          [`${prefixCls.value}-item-disabled`]: item.disabled,
        },
      ];

      // 子菜单面板
      let overlay: VNode | null = null;
      if (grouped) {
        const columns = item.items as any[];
        overlay = (
          <div class={`${prefixCls.value}-overlay`}>
            <div class={`${prefixCls.value}-grid`}>
              {columns.map((col, colIdx) => (
                <div key={`${key}-col-${colIdx}`} class={columnClass(columns.length)}>
                  {renderColumn(col as any[], `${key}-col-${colIdx}`, key)}
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <li
          key={key}
          id={`${prefixCls.value}-${key}`}
          class={itemClass}
          role="menuitem"
          aria-disabled={item.disabled || undefined}
          aria-expanded={grouped ? active : undefined}
          aria-haspopup={grouped ? 'menu' : undefined}
          data-xy-active={active}
        >
          <div
            class={`${prefixCls.value}-item-content`}
            onClick={(e: Event) => onRootItemClick(e, item)}
            onMouseenter={() => onItemMouseEnter(item)}
          >
            {renderItemContent(item)}
          </div>
          {overlay}
        </li>
      );
    }

    expose({
      activeKey: mergedActiveKey,
      setActiveKey,
      items,
    });

    return () => {
      const hasStart = !!slots.start;
      const hasEnd = !!slots.end;

      return wrapSSR(
        <div
          ref={containerRef}
          class={rootClasses.value}
          {...attrs}
          onMouseleave={onContainerMouseLeave}
        >
          {hasStart ? <div class={`${prefixCls.value}-start`}>{slots.start?.()}</div> : null}
          <ul
            class={`${prefixCls.value}-root-list`}
            role="menubar"
            aria-orientation={props.orientation}
            aria-disabled={props.disabled || undefined}
          >
            {items.value.map((item, idx) => renderRootItem(item, idx))}
          </ul>
          {hasEnd ? <div class={`${prefixCls.value}-end`}>{slots.end?.()}</div> : null}
        </div>,
      );
    };
  },
});
