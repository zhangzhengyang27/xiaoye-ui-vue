import {
  baseFlatten_default
} from "./chunk-BJFYEYW6.js";
import {
  overRest_default,
  setToString_default
} from "./chunk-GSCJQZ7U.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/flatten.js
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten_default(array, 1) : [];
}
var flatten_default = flatten;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_flatRest.js
function flatRest(func) {
  return setToString_default(overRest_default(func, void 0, flatten_default), func + "");
}
var flatRest_default = flatRest;

export {
  flatten_default,
  flatRest_default
};
//# sourceMappingURL=chunk-XE5AWOLC.js.map
