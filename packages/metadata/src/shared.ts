export interface MetaType {
  name?: string;
  as?: string;
  from?: string;
  sideEffects?: string | false;
  use?: {
    as?: string;
  };
}

export function toMeta(arr?: any[]): MetaType[] | undefined {
  return arr?.map(item => {
    const it = typeof item === 'string' ? { name: item } : item;

    it.as ??= it?.name;
    it.from ??= `xiaoye-ui/${it?.name?.toLowerCase()}`;

    return it;
  });
}
