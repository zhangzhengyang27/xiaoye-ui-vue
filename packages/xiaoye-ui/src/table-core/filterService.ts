/**
 * table-core 内联过滤器服务
 *
 * 当前项目 `@xiaoye-ui/core/api` 为空占位符，未导出 FilterService / FilterMatchMode / FilterOperator。
 * 为保持 table-core 自包含，将源项目 core/api 中的过滤匹配逻辑内联到此文件。
 * 来源：源项目 packages/core/src/api/{FilterService,FilterMatchMode,FilterOperator}.js
 */

import { equals, removeAccents, resolveFieldData } from '@xiaoye-ui/utils/object';

export const FilterMatchMode = {
  STARTS_WITH: 'startsWith',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  ENDS_WITH: 'endsWith',
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  IN: 'in',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL_TO: 'lte',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL_TO: 'gte',
  BETWEEN: 'between',
  DATE_IS: 'dateIs',
  DATE_IS_NOT: 'dateIsNot',
  DATE_BEFORE: 'dateBefore',
  DATE_AFTER: 'dateAfter',
} as const;

export const FilterOperator = {
  AND: 'and',
  OR: 'or',
} as const;

export type FilterMatchModeValue = (typeof FilterMatchMode)[keyof typeof FilterMatchMode];
export type FilterOperatorValue = (typeof FilterOperator)[keyof typeof FilterOperator];

export const FilterService = {
  filter(
    value: any[],
    fields: string[],
    filterValue: any,
    filterMatchMode: string,
    filterLocale?: string,
  ): any[] {
    const filteredItems: any[] = [];

    if (!value) {
      return filteredItems;
    }

    for (const item of value) {
      if (typeof item === 'string') {
        if ((this.filters as any)[filterMatchMode](item, filterValue, filterLocale)) {
          filteredItems.push(item);
          continue;
        }
      } else {
        for (const field of fields) {
          const fieldValue = resolveFieldData(item, field);

          if ((this.filters as any)[filterMatchMode](fieldValue, filterValue, filterLocale)) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }

    return filteredItems;
  },
  filters: {
    startsWith(value: any, filter: any, filterLocale?: string): boolean {
      if (filter === undefined || filter === null || filter === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      const stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains(value: any, filter: any, filterLocale?: string): boolean {
      if (filter === undefined || filter === null || filter === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      const stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

      return stringValue.indexOf(filterValue) !== -1;
    },
    notContains(value: any, filter: any, filterLocale?: string): boolean {
      if (filter === undefined || filter === null || filter === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      const stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

      return stringValue.indexOf(filterValue) === -1;
    },
    endsWith(value: any, filter: any, filterLocale?: string): boolean {
      if (filter === undefined || filter === null || filter === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = removeAccents(filter.toString()).toLocaleLowerCase(filterLocale);
      const stringValue = removeAccents(value.toString()).toLocaleLowerCase(filterLocale);

      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },
    equals(value: any, filter: any, filterLocale?: string): boolean {
      if (filter === undefined || filter === null || filter === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() === filter.getTime();
      else
        return (
          removeAccents(value.toString()).toLocaleLowerCase(filterLocale) ==
          removeAccents(filter.toString()).toLocaleLowerCase(filterLocale)
        );
    },
    notEquals(value: any, filter: any, filterLocale?: string): boolean {
      if (filter === undefined || filter === null || filter === '') {
        return false;
      }

      if (value === undefined || value === null) {
        return true;
      }

      if (value.getTime && filter.getTime) return value.getTime() !== filter.getTime();
      else
        return (
          removeAccents(value.toString()).toLocaleLowerCase(filterLocale) !=
          removeAccents(filter.toString()).toLocaleLowerCase(filterLocale)
        );
    },
    in(value: any, filter: any): boolean {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      for (let i = 0; i < filter.length; i++) {
        if (equals(value, filter[i])) {
          return true;
        }
      }

      return false;
    },
    between(value: any, filter: any): boolean {
      if (filter == null || filter[0] == null || filter[1] == null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime)
        return filter[0].getTime() <= value.getTime() && value.getTime() <= filter[1].getTime();
      else return filter[0] <= value && value <= filter[1];
    },
    lt(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() < filter.getTime();
      else return value < filter;
    },
    lte(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() <= filter.getTime();
      else return value <= filter;
    },
    gt(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() > filter.getTime();
      else return value > filter;
    },
    gte(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (value.getTime && filter.getTime) return value.getTime() >= filter.getTime();
      else return value >= filter;
    },
    dateIs(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === 'string') {
        value = new Date(value);
      }

      if (typeof filter === 'string') {
        filter = new Date(filter);
      }

      return value.toDateString() === filter.toDateString();
    },
    dateIsNot(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === 'string') {
        value = new Date(value);
      }

      if (typeof filter === 'string') {
        filter = new Date(filter);
      }

      return value.toDateString() !== filter.toDateString();
    },
    dateBefore(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === 'string') {
        value = new Date(value);
      }

      if (typeof filter === 'string') {
        filter = new Date(filter);
      }

      return value.getTime() < filter.getTime();
    },
    dateAfter(value: any, filter: any): boolean {
      if (filter === undefined || filter === null) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === 'string') {
        value = new Date(value);
      }

      if (typeof filter === 'string') {
        filter = new Date(filter);
      }

      return value.getTime() > filter.getTime();
    },
  },
  register(rule: string, fn: (value: any, filter: any, filterLocale?: string) => boolean) {
    (this.filters as any)[rule] = fn;
  },
};
