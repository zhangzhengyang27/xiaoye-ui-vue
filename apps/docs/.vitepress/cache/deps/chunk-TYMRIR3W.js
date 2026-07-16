import {
  isLength_default
} from "./chunk-53DWW2OL.js";
import {
  isFunction_default
} from "./chunk-7GF43Y55.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;

export {
  isArrayLike_default,
  baseUnary_default
};
//# sourceMappingURL=chunk-TYMRIR3W.js.map
