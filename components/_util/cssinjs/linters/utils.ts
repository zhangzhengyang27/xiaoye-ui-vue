import devWarning from '../../../vc-util/warning';
import type { LinterInfo } from './interface';

export function lintWarning(message: string, info: LinterInfo) {
  const { path, parentSelectors } = info;

  devWarning(
    false,
    `[Xiaoye UI CSS-in-JS] ${path ? `Error in '${path}': ` : ''}${message}${
      parentSelectors.length ? ` Selector info: ${parentSelectors.join(' -> ')}` : ''
    }`,
  );
}
