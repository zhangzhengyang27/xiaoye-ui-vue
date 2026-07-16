import {
  castPath_default,
  toKey_default
} from "./chunk-6SKWHXUR.js";
import {
  isIndex_default
} from "./chunk-ASB7QRIM.js";
import {
  isArguments_default,
  isArray_default
} from "./chunk-HYJ6ICRB.js";
import {
  isLength_default
} from "./chunk-53DWW2OL.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseHasIn.js
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
var baseHasIn_default = baseHasIn;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hasPath.js
function hasPath(object, path, hasFunc) {
  path = castPath_default(path, object);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey_default(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
}
var hasPath_default = hasPath;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/hasIn.js
function hasIn(object, path) {
  return object != null && hasPath_default(object, path, baseHasIn_default);
}
var hasIn_default = hasIn;

export {
  hasPath_default,
  hasIn_default
};
//# sourceMappingURL=chunk-YG635LTE.js.map
