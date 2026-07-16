import {
  baseIteratee_default
} from "./chunk-WMBXHCIP.js";
import {
  toNumber_default
} from "./chunk-CDGC4MBH.js";
import {
  keys_default
} from "./chunk-OOVXMLZV.js";
import {
  baseFindIndex_default
} from "./chunk-KIR3EGGD.js";
import {
  isArrayLike_default
} from "./chunk-TYMRIR3W.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_createFind.js
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_default(collection)) {
      var iteratee = baseIteratee_default(predicate, 3);
      collection = keys_default(collection);
      predicate = function(key) {
        return iteratee(iterable[key], key, iterable);
      };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
  };
}
var createFind_default = createFind;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/toFinite.js
var INFINITY = 1 / 0;
var MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_default(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_default = toFinite;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/toInteger.js
function toInteger(value) {
  var result = toFinite_default(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_default = toInteger;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/findIndex.js
var nativeMax = Math.max;
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex_default(array, baseIteratee_default(predicate, 3), index);
}
var findIndex_default = findIndex;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/find.js
var find = createFind_default(findIndex_default);
var find_default = find;

export {
  toFinite_default,
  toInteger_default,
  createFind_default,
  findIndex_default,
  find_default
};
//# sourceMappingURL=chunk-64RP4PSH.js.map
