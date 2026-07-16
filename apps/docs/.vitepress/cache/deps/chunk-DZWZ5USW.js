import {
  baseIteratee_default
} from "./chunk-WMBXHCIP.js";
import {
  keys_default
} from "./chunk-OOVXMLZV.js";
import {
  isArray_default
} from "./chunk-HYJ6ICRB.js";
import {
  isArrayLike_default
} from "./chunk-TYMRIR3W.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayAggregator.js
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}
var arrayAggregator_default = arrayAggregator;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default = createBaseFor;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseForOwn.js
function baseForOwn(object, iteratee) {
  return object && baseFor_default(object, iteratee, keys_default);
}
var baseForOwn_default = baseForOwn;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_createBaseEach.js
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_default(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var createBaseEach_default = createBaseEach;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseEach.js
var baseEach = createBaseEach_default(baseForOwn_default);
var baseEach_default = baseEach;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseAggregator.js
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach_default(collection, function(value, key, collection2) {
    setter(accumulator, value, iteratee(value), collection2);
  });
  return accumulator;
}
var baseAggregator_default = baseAggregator;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_createAggregator.js
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_default(collection) ? arrayAggregator_default : baseAggregator_default, accumulator = initializer ? initializer() : {};
    return func(collection, setter, baseIteratee_default(iteratee, 2), accumulator);
  };
}
var createAggregator_default = createAggregator;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/partition.js
var partition = createAggregator_default(function(result, value, key) {
  result[key ? 0 : 1].push(value);
}, function() {
  return [[], []];
});
var partition_default = partition;

export {
  createBaseFor_default,
  baseFor_default,
  baseForOwn_default,
  createBaseEach_default,
  baseEach_default,
  createAggregator_default,
  partition_default
};
//# sourceMappingURL=chunk-DZWZ5USW.js.map
