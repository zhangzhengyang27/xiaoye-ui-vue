import {
  isObjectLike_default
} from "./chunk-H75WUGG5.js";
import {
  baseGetTag_default
} from "./chunk-ZXW37VCU.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isNumber.js
var numberTag = "[object Number]";
function isNumber(value) {
  return typeof value == "number" || isObjectLike_default(value) && baseGetTag_default(value) == numberTag;
}
var isNumber_default = isNumber;

export {
  isNumber_default
};
//# sourceMappingURL=chunk-MNMPPN7F.js.map
