import {
  defineProperty_default
} from "./chunk-PTCMA745.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var baseAssignValue_default = baseAssignValue;

export {
  baseAssignValue_default
};
//# sourceMappingURL=chunk-ZESHZTK6.js.map
