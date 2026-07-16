import {
  overRest_default,
  setToString_default
} from "./chunk-GSCJQZ7U.js";
import {
  identity_default
} from "./chunk-QIFKTNYX.js";
import {
  isArrayLike_default
} from "./chunk-TYMRIR3W.js";
import {
  isObjectLike_default
} from "./chunk-H75WUGG5.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseRest.js
function baseRest(func, start) {
  return setToString_default(overRest_default(func, start, identity_default), func + "");
}
var baseRest_default = baseRest;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value) {
  return isObjectLike_default(value) && isArrayLike_default(value);
}
var isArrayLikeObject_default = isArrayLikeObject;

export {
  baseRest_default,
  isArrayLikeObject_default
};
//# sourceMappingURL=chunk-PMZVGZSP.js.map
