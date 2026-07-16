import {
  flatRest_default
} from "./chunk-XE5AWOLC.js";
import {
  isPlainObject_default
} from "./chunk-ZQEZORSL.js";
import {
  baseGet_default,
  castPath_default,
  toKey_default
} from "./chunk-6SKWHXUR.js";
import {
  baseClone_default,
  copyObject_default,
  getAllKeysIn_default
} from "./chunk-4VP2SCVE.js";
import {
  arrayMap_default
} from "./chunk-QIFKTNYX.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/last.js
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_default = last;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseSlice.js
function baseSlice(array, start, end) {
  var index = -1, length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
var baseSlice_default = baseSlice;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_parent.js
function parent(object, path) {
  return path.length < 2 ? object : baseGet_default(object, baseSlice_default(path, 0, -1));
}
var parent_default = parent;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseUnset.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseUnset(object, path) {
  path = castPath_default(path, object);
  var index = -1, length = path.length;
  if (!length) {
    return true;
  }
  while (++index < length) {
    var key = toKey_default(path[index]);
    if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) {
      return false;
    }
    if ((key === "constructor" || key === "prototype") && index < length - 1) {
      return false;
    }
  }
  var obj = parent_default(object, path);
  return obj == null || delete obj[toKey_default(last_default(path))];
}
var baseUnset_default = baseUnset;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_customOmitClone.js
function customOmitClone(value) {
  return isPlainObject_default(value) ? void 0 : value;
}
var customOmitClone_default = customOmitClone;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/omit.js
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
var omit = flatRest_default(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap_default(paths, function(path) {
    path = castPath_default(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject_default(object, getAllKeysIn_default(object), result);
  if (isDeep) {
    result = baseClone_default(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone_default);
  }
  var length = paths.length;
  while (length--) {
    baseUnset_default(result, paths[length]);
  }
  return result;
});
var omit_default = omit;

export {
  baseSlice_default,
  last_default,
  parent_default,
  baseUnset_default,
  omit_default
};
//# sourceMappingURL=chunk-Q5ZMGV2V.js.map
