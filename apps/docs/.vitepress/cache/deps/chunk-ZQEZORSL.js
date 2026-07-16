import {
  getPrototype_default
} from "./chunk-2UBQLZ76.js";
import {
  isObjectLike_default
} from "./chunk-H75WUGG5.js";
import {
  baseGetTag_default
} from "./chunk-ZXW37VCU.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isPlainObject.js
var objectTag = "[object Object]";
var funcProto = Function.prototype;
var objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike_default(value) || baseGetTag_default(value) != objectTag) {
    return false;
  }
  var proto = getPrototype_default(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var isPlainObject_default = isPlainObject;

export {
  isPlainObject_default
};
//# sourceMappingURL=chunk-ZQEZORSL.js.map
