import {
  isObjectLike_default
} from "./chunk-H75WUGG5.js";
import {
  baseGetTag_default
} from "./chunk-ZXW37VCU.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isSymbol.js
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;

export {
  isSymbol_default
};
//# sourceMappingURL=chunk-MRXBADJF.js.map
