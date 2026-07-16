import {
  baseAssignValue_default
} from "./chunk-ZESHZTK6.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/fromPairs.js
function fromPairs(pairs) {
  var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
  while (++index < length) {
    var pair = pairs[index];
    baseAssignValue_default(result, pair[0], pair[1]);
  }
  return result;
}
var fromPairs_default = fromPairs;

export {
  fromPairs_default
};
//# sourceMappingURL=chunk-YX4OEKRD.js.map
