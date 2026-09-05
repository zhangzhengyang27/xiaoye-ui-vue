import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Pager',
  inheritAttrs: false,
  props: {
    rootPrefixCls: String,
    page: Number,
    active: { type: Boolean, default: undefined },
    last: { type: Boolean, default: undefined },
    locale: PropTypes.object,
    showTitle: { type: Boolean, default: undefined },
    itemRender: {
      type: Function,
      default: () => {},
    },
    onClick: {
      type: Function,
    },
    onKeypress: {
      type: Function,
    },
  },
  eimt: ['click', 'keypress'],
  setup(props, { emit, attrs }) {
    const handleClick = () => {
      emit('click', props.page);
    };
    const handleKeyPress = (event: KeyboardEvent) => {
      emit('keypress', event, handleClick, props.page);
    };
    return () => {
      const { showTitle, page, itemRender } = props;
      const { class: _cls, style } = attrs;
      const prefixCls = `${props.rootPrefixCls}-item`;
      const cls = classNames(
        prefixCls,
        `${prefixCls}-${props.page}`,
        {
          [`${prefixCls}-active`]: props.active,
          [`${prefixCls}-disabled`]: !props.page,
        },
        _cls,
      );

      return (
        <li
          onClick={handleClick}
          onKeypress={handleKeyPress}
          title={showTitle ? String(page) : null}
          tabindex="0"
          class={cls}
          style={style as CSSProperties}
          role="button"
          // 当前页标记为 aria-current，便于读屏软件播报「当前页」
          aria-current={props.active ? 'page' : undefined}
          aria-disabled={!page || undefined}
          aria-label={String(page)}
        >
          {itemRender({
            page,
            type: 'page',
            // 语义已由外层 li[role=button] 承担，内层链接不再暴露给辅助技术
            originalElement: (
              <a rel="nofollow" aria-hidden="true" tabindex="-1">
                {page}
              </a>
            ),
          })}
        </li>
      );
    };
  },
});
