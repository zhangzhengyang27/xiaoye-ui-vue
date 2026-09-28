/**
 * 归属 pin：锁定「已经发布出去的」冲突名归属，避免生成器换 owner 后改变公开 API。
 *
 * 这里只登记 6.x 已经在发布的具体名字，新增组件之间产生的冲突由 entry-generator
 * 自动消解，不需要往这里加条目；pin 一旦失效（名字不再冲突或 owner 目录被删）会由
 * `gen-entries --check` 报错，防止清单腐烂。
 *
 * 今天从包根 `xiaoye-ui` 能拿到的这三个名字，其类型来自右侧目录：
 */
export const OWNERSHIP_PINS = {
  // list 里同名类型是响应式栅格断言联合（'gutter' | 'column' | 'xs' ...），
  // 但 6.x 发布的是表格列定义，且后者是使用者实际依赖的语义。
  ColumnType: 'table',
  // select 与 tree-select 各自声明了同名类型；LabeledValue 两处结构一致，
  // SelectValue 则 select 版多了 `| undefined`。为不改变已发布的类型形状，保持 tree-select。
  LabeledValue: 'tree-select',
  SelectValue: 'tree-select',
};
