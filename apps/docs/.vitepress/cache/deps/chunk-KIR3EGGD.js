// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseFindIndex.js
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var baseFindIndex_default = baseFindIndex;

export {
  baseFindIndex_default
};
//# sourceMappingURL=chunk-KIR3EGGD.js.map
