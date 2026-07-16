// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var arrayMap_default = arrayMap;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
var identity_default = identity;

export {
  arrayMap_default,
  identity_default
};
//# sourceMappingURL=chunk-QIFKTNYX.js.map
