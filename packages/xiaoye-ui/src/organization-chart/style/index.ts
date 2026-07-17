import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export default genComponentStyleHook('OrganizationChart', token => {
  const {
    componentCls,
    colorBgContainer,
    colorText,
    colorBorder,
    borderRadius,
    colorBgLayout,
    colorPrimary,
    colorTextLightSolid,
    colorTextSecondary,
  } = token;

  const gutter = '0.75rem';
  const transitionDuration = '0.2s';
  const nodePadding = '1rem 1.25rem';
  const nodeToggleablePadding = '1rem 1.25rem 1.5rem 1.25rem';
  const toggleButtonSize = '1.75rem';
  const connectorHeight = '24px';
  const focusRing = `0 0 0 3px color-mix(in srgb, ${colorPrimary} 20%, transparent)`;
  const opacityDisabled = 0.6;

  return {
    [componentCls]: {
      display: 'block',

      [`&-table`]: {
        borderSpacing: 0,
        borderCollapse: 'separate',
        margin: '0 auto',

        '> tbody > tr > td': {
          textAlign: 'center',
          verticalAlign: 'top',
          padding: `0 ${gutter}`,
        },
      },

      [`&-node`]: {
        display: 'inline-block',
        position: 'relative',
        border: `1px solid ${colorBorder}`,
        background: colorBgContainer,
        color: colorText,
        padding: nodePadding,
        borderRadius,
        transition: `background ${transitionDuration}, border-color ${transitionDuration}, color ${transitionDuration}, box-shadow ${transitionDuration}`,

        [`&:has(${componentCls}-node-toggle-button)`]: {
          padding: nodeToggleablePadding,
        },

        '&-selectable': {
          cursor: 'pointer',
        },

        '&-selectable:not(&-selected):hover': {
          background: colorBgLayout,
          color: colorText,
        },

        '&-selected': {
          background: colorPrimary,
          color: colorTextLightSolid,
        },
      },

      [`&-node-toggle-button`]: {
        position: 'absolute',
        bottom: '-0.875rem',
        left: '50%',
        marginLeft: '-0.875rem',
        zIndex: 2,
        userSelect: 'none',
        cursor: 'pointer',
        width: toggleButtonSize,
        height: toggleButtonSize,
        textDecoration: 'none',
        background: colorBgContainer,
        color: colorTextSecondary,
        borderRadius: '50%',
        border: `1px solid ${colorBorder}`,
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        outlineColor: 'transparent',
        transition: `background ${transitionDuration}, color ${transitionDuration}, border-color ${transitionDuration}, outline-color ${transitionDuration}, box-shadow ${transitionDuration}`,

        '&:hover': {
          background: colorBgLayout,
          color: colorText,
        },

        '&:focus-visible': {
          boxShadow: focusRing,
          outline: `2px solid ${colorPrimary}`,
          outlineOffset: '2px',
        },

        '&-disabled': {
          cursor: 'default',
          opacity: opacityDisabled,
        },
      },

      [`&-node-toggle-button-icon`]: {
        position: 'relative',
        top: '1px',
      },

      [`&-connector-down`]: {
        margin: '0 auto',
        height: connectorHeight,
        width: '1px',
        background: colorBorder,
      },

      [`&-connector-left`]: {
        borderRadius: 0,
        borderInlineEnd: `1px solid ${colorBorder}`,
      },

      [`&-connector-right`]: {
        borderRadius: 0,
      },

      [`&-connector-top`]: {
        borderBlockStart: `1px solid ${colorBorder}`,
      },

      [`&-connectors`]: {
        [`:nth-child(1 of ${componentCls}-connector-left)`]: {
          borderInlineEnd: '0 none',
        },

        [`:nth-last-child(1 of ${componentCls}-connector-left)`]: {
          borderStartEndRadius: borderRadius,
        },

        [`:nth-child(1 of ${componentCls}-connector-right)`]: {
          borderInlineStart: `1px solid ${colorBorder}`,
          borderStartStartRadius: borderRadius,
        },
      },
    },
  } as CSSObject;
});
