import { isNotEmpty } from '@xiaoye-ui/utils';
import { getDotPath, safeParse, safeParseAsync } from 'valibot';
import { toValues } from '../../utils/forms';

export const valibotResolver =
  (schema, schemaOptions, resolverOptions) =>
  async ({ values, name }) => {
    const { sync = false, raw = false } = resolverOptions || {};

    const result = sync
      ? safeParse(schema, values, { abortPipeEarly: false, ...schemaOptions })
      : await safeParseAsync(schema, values, { abortPipeEarly: false, ...schemaOptions });

    if (result.success) {
      return {
        values: toValues(raw ? values : result.output, name),
        errors: {},
      };
    }

    return {
      values: toValues(raw ? values : undefined, name),
      errors: result.issues?.reduce((acc, error) => {
        const path = getDotPath(error);
        const pathKey = isNotEmpty(path) ? path : name;

        if (pathKey) {
          acc[pathKey] ||= [];
          acc[pathKey].push(error);
        }

        return acc;
      }, {}),
    };
  };
