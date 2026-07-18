import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';

// 目录树组件 Token
export interface ComponentToken {}

// 目录树扩展 Token
export type DirectoryTreeToken = FullToken<'DirectoryTree'>;

// 生成目录树样式：在 Tree 已有的目录样式之上补充容器级样式
const genDirectoryTreeStyle: GenerateStyle<DirectoryTreeToken, CSSObject> = token => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      // 目录树默认占满父级宽度，符合文件浏览器的常见布局
      width: '100%',
    },
  };
};

// 样式 Hook：基于 Design Token，复用 Tree 在 directory-tree 前缀下生成的完整树样式
export default genComponentStyleHook('DirectoryTree', token => [
  genDirectoryTreeStyle(token as DirectoryTreeToken),
]);
