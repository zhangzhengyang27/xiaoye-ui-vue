import type { ExtractPropTypes, HTMLAttributes } from 'vue';
import { computed, defineComponent } from 'vue';
import Button from '../button';
import Dropdown from '../dropdown';
import Menu from '../menu';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import { DownOutlined } from '@xiaoye-ui/icons';
import { splitButtonProps } from './splitButtonTypes';
import type { SplitButtonItem } from './splitButtonTypes';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import type { CustomSlotsType } from '../_util/type';

const ButtonGroup = Button.Group;

export type SplitButtonProps = Partial<ExtractPropTypes<ReturnType<typeof splitButtonProps>>>;

// 递归渲染菜单项
function renderMenuItems(items: SplitButtonItem[], MenuItem: any, SubMenu: any, Divider: any) {
  return items.map((item, index) => {
    if (!item) return null;
    // 在该项前渲染分割线
    const divider =
      item.divided && index > 0 ? <Divider key={`divider_${item.key ?? index}`} /> : null;
    const itemKey = item.key ?? index;

    // 存在 children 时渲染为子菜单
    if (item.children && item.children.length > 0) {
      return [
        divider,
        <SubMenu key={itemKey} title={item.label} icon={item.icon} disabled={item.disabled}>
          {renderMenuItems(item.children, MenuItem, SubMenu, Divider)}
        </SubMenu>,
      ];
    }

    return [
      divider,
      <MenuItem
        key={itemKey}
        disabled={item.disabled}
        danger={item.danger}
        icon={item.icon}
        title={item.title}
      >
        {typeof item.label === 'function' ? item.label() : item.label}
      </MenuItem>,
    ];
  });
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYSplitButton',
  inheritAttrs: false,
  __XY_SPLIT_BUTTON: true,
  props: initDefaultProps(splitButtonProps(), {
    type: 'default',
    trigger: 'hover',
    placement: 'bottomRight',
  }),
  slots: Object as CustomSlotsType<{
    icon: any;
    default: any;
    overlay: any;
  }>,
  // emits: ['click', 'itemClick', 'openChange'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction, getPopupContainer } = useConfigInject('split-button', props);
    const splitButtonPrefixCls = computed(() => prefixCls.value);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 主按钮点击
    const handleButtonClick = (e: MouseEvent) => {
      emit('click', e);
    };

    // 菜单显示状态变化
    const handleOpenChange = (val: boolean) => {
      emit('openChange', val);
    };

    // 菜单项点击
    const handleMenuClick = (info: any) => {
      emit('itemClick', info);
    };

    return () => {
      const {
        type = 'default',
        size,
        disabled,
        loading,
        danger,
        ghost,
        label,
        icon = slots.icon?.(),
        model,
        menuClass,
        trigger,
        arrow,
        placement = direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
        onClick: _onClick,
        onItemClick: _onItemClick,
        prefixCls: _prefixCls,
        ...restProps
      } = { ...props, ...attrs } as SplitButtonProps & HTMLAttributes;

      // 下拉菜单内容：优先使用 overlay 插槽，否则用 model 渲染 Menu
      const overlay =
        slots.overlay?.() ??
        (model && model.length > 0 ? (
          <Menu class={menuClass} selectable={false} onClick={handleMenuClick}>
            {renderMenuItems(model, Menu.Item, Menu.SubMenu, Menu.Divider)}
          </Menu>
        ) : (
          <Menu />
        ));

      const dropdownProps = {
        trigger: disabled ? [] : trigger,
        placement,
        arrow,
        disabled,
        getPopupContainer: getPopupContainer?.value,
        onOpenChange: handleOpenChange,
      };

      // 左侧主按钮
      const leftButton = (
        <Button
          type={type}
          size={size}
          disabled={disabled}
          loading={loading}
          danger={danger}
          ghost={ghost}
          icon={icon}
          onClick={handleButtonClick}
          v-slots={{ default: slots.default ?? (() => label) }}
        />
      );

      // 右侧下拉触发按钮
      const rightButton = (
        <Button
          type={type}
          size={size}
          disabled={disabled}
          loading={loading}
          danger={danger}
          ghost={ghost}
          icon={<DownOutlined />}
        />
      );

      return wrapSSR(
        <ButtonGroup
          {...restProps}
          class={classNames(splitButtonPrefixCls.value, attrs.class, hashId.value)}
        >
          {leftButton}
          <Dropdown {...dropdownProps} v-slots={{ overlay: () => overlay }}>
            {rightButton}
          </Dropdown>
        </ButtonGroup>,
      );
    };
  },
});
