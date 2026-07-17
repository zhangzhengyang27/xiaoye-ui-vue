import classNames from '../_util/classNames';
import { defineComponent, computed, ref } from 'vue';
import Tooltip from '../tooltip';
import Badge from '../badge';
import Content from './FloatButtonContent';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectFloatButtonGroupContext } from './context';
import warning from '../_util/warning';
import { initDefaultProps } from '../_util/props-util';
import { floatButtonProps } from './interface';
// import { useCompactItemContext } from '../space/Compact';

// CSSINJS
import useStyle from './style';

export const floatButtonPrefixCls = 'float-btn';

const FloatButton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'XYFloatButton',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonProps(), { type: 'default', shape: 'circle' }),
  setup(props, { attrs, slots }) {
    const { prefixCls, direction, rootPrefixCls } = useConfigInject(floatButtonPrefixCls, props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const { shape: groupShape } = useInjectFloatButtonGroupContext();

    const floatButtonRef = ref<HTMLAnchorElement | HTMLButtonElement>(null);

    const mergeShape = computed(() => {
      return groupShape?.value || props.shape;
    });

    const isUnBorderedButtonType = (type: string | undefined) => type === 'text' || type === 'link';

    const handleClick = (e: MouseEvent) => {
      if (isUnBorderedButtonType(props.type)) {
        return;
      }
      const node = floatButtonRef.value;
      if (node) {
        node.setAttribute(`${rootPrefixCls.value}-click-animating-without-extra-node`, 'true');
      }
      (attrs.onClick as any)?.(e);
    };

    return () => {
      const {
        prefixCls: customPrefixCls,
        type = 'default',
        shape = 'circle',
        description = slots.description?.(),
        tooltip,
        badge = {},
        ...restProps
      } = props;

      const classString = classNames(
        prefixCls.value,
        `${prefixCls.value}-${type}`,
        `${prefixCls.value}-${mergeShape.value}`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
        hashId.value,
      );

      const buttonNode = (
        <Tooltip
          placement="left"
          v-slots={{
            title:
              slots.tooltip || tooltip
                ? () => (slots.tooltip && slots.tooltip()) || tooltip
                : undefined,
            default: () => (
              <Badge {...badge}>
                <div class={`${prefixCls.value}-body`}>
                  <Content
                    prefixCls={prefixCls.value}
                    v-slots={{
                      icon: slots.icon,
                      description: () => description,
                    }}
                  ></Content>
                </div>
              </Badge>
            ),
          }}
        ></Tooltip>
      );

      if (process.env.NODE_ENV !== 'production') {
        warning(
          !(shape === 'circle' && description),
          'FloatButton',
          'supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.',
        );
      }

      const buttonProps = {
        ...attrs,
        ...restProps,
        class: classString,
        onClick: handleClick,
      };

      return wrapSSR(
        props.href ? (
          <a ref={floatButtonRef} {...buttonProps}>
            {buttonNode}
          </a>
        ) : (
          <button ref={floatButtonRef} {...buttonProps} type="button">
            {buttonNode}
          </button>
        ),
      );
    };
  },
});

export default FloatButton;
