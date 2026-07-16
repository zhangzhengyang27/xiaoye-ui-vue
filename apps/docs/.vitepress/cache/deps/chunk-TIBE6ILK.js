import {
  baseAssignValue_default
} from "./chunk-ZESHZTK6.js";
import {
  eq_default
} from "./chunk-ZLUQO3R2.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_assignValue.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var assignValue_default = assignValue;

export {
  assignValue_default
};
//# sourceMappingURL=chunk-TIBE6ILK.js.map
