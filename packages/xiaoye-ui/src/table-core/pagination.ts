/**
 * table-core 分页逻辑
 *
 * 合并 DataTable.tsx 和 TreeTable.tsx 中几乎 1:1 复制的分页切片逻辑。
 */

/**
 * 数据切片分页
 * 来源：DataTable.tsx 第 1962-1972 行（dataToRender）/ TreeTable.tsx 第 141-150 行（dataToRender）
 */
export function paginate(data: any[], first: number, rows: number): any[] {
  if (!data || !data.length) return data || [];

  return data.slice(first, first + rows);
}
