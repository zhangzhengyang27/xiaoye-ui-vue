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

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIntersection.js
var nativeMin = Math.min;
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith_default : arrayIncludes_default, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result = [];
  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap_default(array, baseUnary_default(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache_default(othIndex && array) : void 0;
  }
  array = arrays[0];
  var index = -1, seen = caches[0];
  outer:
    while (++index < length && result.length < maxLength) {
      var value = array[index], computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;
      if (!(seen ? cacheHas_default(seen, computed) : includes(result, computed, comparator))) {
        othIndex = othLength;
        while (--othIndex) {
          var cache = caches[othIndex];
          if (!(cache ? cacheHas_default(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
            continue outer;
          }
        }
        if (seen) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
var baseIntersection_default = baseIntersection;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_castArrayLikeObject.js
function castArrayLikeObject(value) {
  return isArrayLikeObject_default(value) ? value : [];
}
var castArrayLikeObject_default = castArrayLikeObject;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/intersection.js
var intersection = baseRest_default(function(arrays) {
  var mapped = arrayMap_default(arrays, castArrayLikeObject_default);
  return mapped.length && mapped[0] === arrays[0] ? baseIntersection_default(mapped) : [];
});
var intersection_default = intersection;

export {
  baseIntersection_default,
  castArrayLikeObject_default,
  intersection_default
};
//# sourceMappingURL=chunk-RWYYCWHX.js.map
