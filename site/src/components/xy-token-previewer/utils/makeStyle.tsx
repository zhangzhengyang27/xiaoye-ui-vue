import type { CSSInterpolation } from 'xiaoye-ui/es/_util/cssinjs';
import { useStyleRegister } from 'xiaoye-ui/es/_util/cssinjs';
import { theme as xyTheme } from 'xiaoye-ui';
import type { GlobalToken } from 'xiaoye-ui/es/theme/interface';
import { mergeToken } from 'xiaoye-ui/es/theme/internal';
import { computed } from 'vue';
import useConfigInject from 'xiaoye-ui/es/config-provider/hooks/useConfigInject';

import type { UseComponentStyleResult } from 'xiaoye-ui/es/theme/internal';
const makeStyle = (
  path: string,
  styleFn: (token: GlobalToken & { rootCls: string }) => CSSInterpolation,
) => {
  return (): UseComponentStyleResult => {
    const { theme, token, hashId } = xyTheme.useToken();

    const { getPrefixCls } = useConfigInject('', {});

    const rootCls = getPrefixCls();

    const componentInfo = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: [path],
      };
    });
    return [
      useStyleRegister(componentInfo, () => {
        const mergedToken = mergeToken<GlobalToken & { rootCls: string }>(token.value, {
          rootCls: `.${rootCls}`,
        });
        const styleInterpolation = styleFn(mergedToken);

        return [styleInterpolation];
      }),
      hashId,
    ];
  };
};

export default makeStyle;
