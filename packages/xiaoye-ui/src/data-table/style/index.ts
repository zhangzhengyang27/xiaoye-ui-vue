import type { CSSObject } from '../../_util/cssinjs';
import genComponentStyleHook from '../../theme/util/genComponentStyleHook';

export interface ComponentToken {}

export default genComponentStyleHook(
  'DataTable',
  token => {
    const {
      componentCls,
      colorBgLayout,
      colorText,
      colorBorder,
      paddingSM,
      paddingMD,
      paddingLG,
      paddingXS,
      colorBgContainer,
      colorPrimary,
      colorTextSecondary,
      borderRadius,
      borderRadiusSM,
      boxShadowTertiary,
    } = token;

    const cellPadding = `${paddingSM}px ${paddingMD}px`;
    const cellPaddingSM = `${paddingXS}px ${paddingSM}px`;
    const cellPaddingLG = `${paddingMD}px ${paddingLG}px`;
    const selectedPrimaryBg = `color-mix(in srgb, ${colorPrimary} 10%, transparent)`;
    const focusOutline = `2px solid ${colorPrimary}`;

    return {
      [componentCls]: {
        position: 'relative',
        display: 'block',

        '&__table': {
          borderSpacing: 0,
          borderCollapse: 'separate',
          width: '100%',
        },

        '&__table-container': {
          overflow: 'auto',
        },

        '&--scrollable &__table-container': {
          position: 'relative',
        },

        '&__table--scrollable &__head': {
          insetBlockStart: 0,
          zIndex: 1,
        },

        '&__table--scrollable &__body--frozen': {
          position: 'sticky',
          zIndex: 1,
        },

        '&__table--scrollable &__foot': {
          insetBlockEnd: 0,
          zIndex: 1,
        },

        '&--scrollable &__cell--frozen': {
          position: 'sticky',
        },

        '&--scrollable &__head &__cell--frozen': {
          zIndex: 1,
        },

        '&--scrollable &__body &__cell--frozen': {
          background: 'inherit',
        },

        '&--scrollable &__table-container > &__table > &__head, &--scrollable &__table-container > .xy-virtualscroller > &__table > &__head':
          {
            background: colorBgLayout,
          },

        '&--scrollable &__table-container > &__table > &__foot, &--scrollable &__table-container > .xy-virtualscroller > &__table > &__foot':
          {
            background: colorBgLayout,
          },

        '&--flex-scrollable': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },

        '&--flex-scrollable &__table-container': {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        },

        '&__table--scrollable &__body > &__row-group-header': {
          position: 'sticky',
          zIndex: 1,
        },

        '&__table--resizable &__head > tr > th, &__table--resizable &__foot > tr > td, &__table--resizable &__body > tr > td':
          {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          },

        '&__table--resizable &__head > tr > th&__cell--resizable:not(&__cell--frozen)': {
          backgroundClip: 'padding-box',
          position: 'relative',
        },

        '&__table--resizable-fit &__head > tr > th&__cell--resizable:last-child &__column-resizer':
          {
            display: 'none',
          },

        '&__column-resizer': {
          display: 'block',
          position: 'absolute',
          insetBlockStart: 0,
          insetInlineEnd: 0,
          margin: 0,
          width: 2,
          height: '100%',
          padding: 0,
          cursor: 'col-resize',
          border: '1px solid transparent',
        },

        '&__column-header-content': {
          display: 'flex',
          alignItems: 'center',
          gap: `${paddingXS}px`,
        },

        '&__column-resize-indicator': {
          width: 2,
          position: 'absolute',
          zIndex: 10,
          display: 'none',
          background: colorPrimary,
        },

        '&__row-reorder-indicator-up, &__row-reorder-indicator-down': {
          position: 'absolute',
          display: 'none',
        },

        '&__head &__cell--reorderable, &__reorderable-row-handle': {
          cursor: 'move',
        },

        '&__mask': {
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        },

        '&__filter--inline': {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: `${paddingSM}px`,
        },

        '&__filter--inline &__filter-element-container': {
          flex: '1 1 auto',
          width: '1%',
        },

        '&__filter-overlay': {
          background: colorBgContainer,
          color: colorText,
          border: `1px solid ${colorBorder}`,
          borderRadius: `${borderRadius}px`,
          boxShadow: boxShadowTertiary,
          minWidth: '12.5rem',
        },

        '&__filter-constraint-list': {
          margin: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          padding: `${paddingXS}px 0`,
          gap: `${paddingXS}px`,
        },

        '&__filter-constraint': {
          padding: `${paddingXS}px ${paddingSM}px`,
          color: colorText,
          borderRadius: `${borderRadiusSM}px`,
          cursor: 'pointer',
          transition: `background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s`,
        },

        '&__filter-constraint--selected': {
          background: selectedPrimaryBg,
          color: colorPrimary,
        },

        '&__filter-constraint:not(&__filter-constraint--selected):hover': {
          background: colorBgLayout,
          color: colorText,
        },

        '&__filter-constraint:focus-visible': {
          outline: 0,
          background: colorBgLayout,
          color: colorText,
        },

        '&__filter-constraint--selected:focus-visible': {
          outline: 0,
          background: selectedPrimaryBg,
          color: colorPrimary,
        },

        '&__filter-constraint-separator': {
          borderBlockStart: `1px solid ${colorBorder}`,
        },

        '&__filter--popover': {
          display: 'inline-flex',
          marginInlineStart: 'auto',
        },

        '&__filter-overlay--popover': {
          background: colorBgContainer,
          color: colorText,
          border: `1px solid ${colorBorder}`,
          borderRadius: `${borderRadius}px`,
          boxShadow: boxShadowTertiary,
          minWidth: '12.5rem',
          padding: `${paddingMD}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${paddingSM}px`,
        },

        '&__filter-operator-dropdown': {
          width: '100%',
        },

        '&__filter-rule-list, &__filter-rule': {
          display: 'flex',
          flexDirection: 'column',
          gap: `${paddingSM}px`,
        },

        '&__filter-rule': {
          borderBlockEnd: `1px solid ${colorBorder}`,
          paddingBottom: `${paddingSM}px`,
        },

        '&__filter-rule:last-child': {
          borderBlockEnd: 0,
          paddingBottom: 0,
        },

        '&__filter-add-rule-button, &__filter-remove-rule-button': {
          width: '100%',
        },

        '&__filter-buttonbar': {
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },

        '&__virtualscroller-spacer': {
          display: 'flex',
        },

        '& .xy-virtualscroller .xy-virtualscroller-loading': {
          transform: 'none !important',
          minHeight: 0,
          position: 'sticky',
          insetBlockStart: 0,
          insetInlineStart: 0,
        },

        '&__pagination--top': {
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
        },

        '&__pagination--bottom': {
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '1px 0 0 0',
        },

        '&__header': {
          background: colorBgLayout,
          color: colorText,
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
          padding: `${paddingMD}px`,
        },

        '&__footer': {
          background: colorBgLayout,
          color: colorText,
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
          padding: `${paddingMD}px`,
        },

        '&__head > tr > th': {
          padding: cellPadding,
          background: colorBgLayout,
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
          color: colorText,
          fontWeight: 'normal',
          textAlign: 'start',
          transition: `background 0.2s, color 0.2s, border-color 0.2s, outline-color 0.2s, box-shadow 0.2s`,
        },

        '&__column-title': {
          fontWeight: 500,
        },

        '&__body > tr': {
          outlineColor: 'transparent',
          background: colorBgContainer,
          color: colorText,
          transition: `background 0.2s, color 0.2s, border-color 0.2s, outline-color 0.2s, box-shadow 0.2s`,
        },

        '&__body > tr > td': {
          textAlign: 'start',
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
          padding: cellPadding,
        },

        '&--hoverable &__body > tr:not(&__row--selected):hover': {
          background: colorBgLayout,
          color: colorText,
        },

        '&__body > tr&__row--selected': {
          background: selectedPrimaryBg,
          color: colorPrimary,
        },

        '&__body > tr&__row--selected > td': {
          borderBlockEndColor: colorPrimary,
        },

        '&__body > tr:focus-visible, &__body > tr&__row--selected-contextmenu': {
          boxShadow: 'none',
          outline: focusOutline,
          outlineOffset: -1,
        },

        '&__foot > tr > td': {
          textAlign: 'start',
          padding: cellPadding,
          borderColor: colorBorder,
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
          color: colorText,
          background: colorBgLayout,
        },

        '&__column-footer': {
          fontWeight: 500,
        },

        '&__cell--sortable': {
          cursor: 'pointer',
          userSelect: 'none',
          outlineColor: 'transparent',
        },

        '&__column-title, &__sort-icon, &__sort-badge': {
          verticalAlign: 'middle',
        },

        '&__sort-icon': {
          color: colorTextSecondary,
          fontSize: '0.875rem',
          width: '0.875rem',
          height: '0.875rem',
          transition: 'color 0.2s',
        },

        '&__cell--sortable:not(&__cell--sorted):hover': {
          background: colorBgLayout,
          color: colorText,
        },

        '&__cell--sortable:not(&__cell--sorted):hover &__sort-icon': {
          color: colorPrimary,
        },

        '&__cell--sorted': {
          background: selectedPrimaryBg,
          color: colorPrimary,
        },

        '&__cell--sorted &__sort-icon': {
          color: colorPrimary,
        },

        '&__cell--sortable:focus-visible': {
          boxShadow: 'none',
          outline: focusOutline,
          outlineOffset: -1,
        },

        '&--hoverable &__row--selectable': {
          cursor: 'pointer',
        },

        '&__body > tr&__row--dragpoint-top > td': {
          boxShadow: `inset 0 2px 0 0 ${colorPrimary}`,
        },

        '&__body > tr&__row--dragpoint-bottom > td': {
          boxShadow: `inset 0 -2px 0 0 ${colorPrimary}`,
        },

        '&__loading-icon': {
          fontSize: '2rem',
          width: '2rem',
          height: '2rem',
        },

        '&--gridlines &__header': {
          borderWidth: '1px 1px 0 1px',
        },

        '&--gridlines &__footer': {
          borderWidth: '0 1px 1px 1px',
        },

        '&--gridlines &__pagination--top': {
          borderWidth: '1px 1px 0 1px',
        },

        '&--gridlines &__pagination--bottom': {
          borderWidth: '0 1px 1px 1px',
        },

        '&--gridlines &__head > tr > th': {
          borderWidth: '1px 0 1px 1px',
        },

        '&--gridlines &__head > tr > th:last-child': {
          borderWidth: 1,
        },

        '&--gridlines &__foot > tr > td': {
          borderWidth: '1px 0 1px 1px',
        },

        '&--gridlines &__foot > tr > td:last-child': {
          borderWidth: '1px 1px 1px 1px',
        },

        '&--gridlines &__head + &__foot > tr > td': {
          borderWidth: '0 0 1px 1px',
        },

        '&--gridlines &__head + &__foot > tr > td:last-child': {
          borderWidth: '0 1px 1px 1px',
        },

        '&--gridlines &__body > tr > td': {
          borderWidth: '0 0 1px 1px',
        },

        '&--gridlines &__body > tr > td:last-child': {
          borderWidth: '0 1px 1px 1px',
        },

        '&--gridlines &__body > tr:last-child > td': {
          borderWidth: '0 0 0 1px',
        },

        '&--gridlines &__body > tr:last-child > td:last-child': {
          borderWidth: '0 1px 0 1px',
        },

        '&--striped &__body > tr&__row--odd': {
          background: colorBgLayout,
        },

        '&--striped &__body > tr&__row--odd&__row--selected': {
          background: selectedPrimaryBg,
          color: colorPrimary,
        },

        '&--striped&--hoverable &__body > tr:not(&__row--selected):hover': {
          background: colorBgLayout,
          color: colorText,
        },

        '&--small &__header': {
          padding: cellPadding,
        },

        '&--small &__head > tr > th': {
          padding: cellPaddingSM,
        },

        '&--small &__body > tr > td': {
          padding: cellPaddingSM,
        },

        '&--small &__foot > tr > td': {
          padding: cellPaddingSM,
        },

        '&--small &__footer': {
          padding: cellPadding,
        },

        '&--large &__header': {
          padding: cellPaddingLG,
        },

        '&--large &__head > tr > th': {
          padding: cellPaddingLG,
        },

        '&--large &__body > tr > td': {
          padding: cellPaddingLG,
        },

        '&--large &__foot > tr > td': {
          padding: cellPaddingLG,
        },

        '&--large &__footer': {
          padding: cellPaddingLG,
        },

        '&__row-toggle-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          width: '1.5rem',
          height: '1.5rem',
          color: colorTextSecondary,
          border: '0 none',
          background: 'transparent',
          cursor: 'pointer',
          borderRadius: `${borderRadiusSM}px`,
          transition: `background 0.2s, color 0.2s, border-color 0.2s, outline-color 0.2s, box-shadow 0.2s`,
          outlineColor: 'transparent',
          userSelect: 'none',
        },

        '&__row-toggle-button:enabled:hover': {
          color: colorPrimary,
          background: 'transparent',
        },

        '&__body > tr&__row--selected &__row-toggle-button:hover': {
          background: 'transparent',
          color: colorPrimary,
        },

        '&__row-toggle-button:focus-visible': {
          boxShadow: 'none',
          outline: focusOutline,
          outlineOffset: -1,
        },

        '&__row-toggle-icon:dir(rtl)': {
          transform: 'rotate(180deg)',
        },
      },
    } as CSSObject;
  },
  'xy-data-table',
);
