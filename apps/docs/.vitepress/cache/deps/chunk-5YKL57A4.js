import {
  baseFlatten_default
} from "./chunk-BJFYEYW6.js";
import {
  baseRest_default,
  isArrayLikeObject_default
} from "./chunk-PMZVGZSP.js";
import {
  arrayIncludesWith_default,
  arrayIncludes_default
} from "./chunk-CE3X42MH.js";
import {
  arrayMap_default
} from "./chunk-QIFKTNYX.js";
import {
  SetCache_default,
  cacheHas_default
} from "./chunk-MPFAXI73.js";
import {
  baseUnary_default
} from "./chunk-TYMRIR3W.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseDifference.js
var LARGE_ARRAY_SIZE = 200;
function baseDifference(array, values, iteratee, comparator) {
  var index = -1, includes = arrayIncludes_default, isCommon = true, length = array.length, result = [], valuesLength = values.length;
  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap_default(values, baseUnary_default(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith_default;
    isCommon = false;
  } else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas_default;
    isCommon = false;
    values = new SetCache_default(values);
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee == null ? value : iteratee(value);
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }
  return result;
}
var baseDifference_default = baseDifference;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/difference.js
var difference = baseRest_default(function(array, values) {
  return isArrayLikeObject_default(array) ? baseDifference_default(array, baseFlatten_default(values, 1, isArrayLikeObject_default, true)) : [];
});
var difference_default = difference;

export {
  baseDifference_default,
  difference_default
};
//# sourceMappingURL=chunk-5YKL57A4.js.map
