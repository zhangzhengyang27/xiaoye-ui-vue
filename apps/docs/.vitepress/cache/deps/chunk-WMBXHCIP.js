import {
  hasIn_default
} from "./chunk-YG635LTE.js";
import {
  baseGet_default,
  isKey_default,
  toKey_default
} from "./chunk-6SKWHXUR.js";
import {
  baseIsEqual_default
} from "./chunk-MQOQOA2T.js";
import {
  Stack_default,
  keys_default
} from "./chunk-OOVXMLZV.js";
import {
  identity_default
} from "./chunk-QIFKTNYX.js";
import {
  isArray_default
} from "./chunk-HYJ6ICRB.js";
import {
  isObject_default
} from "./chunk-RDHO654O.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/get.js
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet_default(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_default = get;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseProperty.js
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var baseProperty_default = baseProperty;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_basePropertyDeep.js
function basePropertyDeep(path) {
  return function(object) {
    return baseGet_default(object, path);
  };
}
var basePropertyDeep_default = basePropertyDeep;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/property.js
function property(path) {
  return isKey_default(path) ? baseProperty_default(toKey_default(path)) : basePropertyDeep_default(path);
}
var property_default = property;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsMatch.js
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length, length = index, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object[key], srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack_default();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var baseIsMatch_default = baseIsMatch;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_isStrictComparable.js
function isStrictComparable(value) {
  return value === value && !isObject_default(value);
}
var isStrictComparable_default = isStrictComparable;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getMatchData.js
function getMatchData(object) {
  var result = keys_default(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable_default(value)];
  }
  return result;
}
var getMatchData_default = getMatchData;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_matchesStrictComparable.js
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var matchesStrictComparable_default = matchesStrictComparable;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseMatches.js
function baseMatches(source) {
  var matchData = getMatchData_default(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch_default(object, source, matchData);
  };
}
var baseMatches_default = baseMatches;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseMatchesProperty.js
var COMPARE_PARTIAL_FLAG2 = 1;
var COMPARE_UNORDERED_FLAG2 = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey_default(path) && isStrictComparable_default(srcValue)) {
    return matchesStrictComparable_default(toKey_default(path), srcValue);
  }
  return function(object) {
    var objValue = get_default(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG2 | COMPARE_UNORDERED_FLAG2);
  };
}
var baseMatchesProperty_default = baseMatchesProperty;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIteratee.js
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity_default;
  }
  if (typeof value == "object") {
    return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
  }
  return property_default(value);
}
var baseIteratee_default = baseIteratee;

export {
  get_default,
  baseIsMatch_default,
  getMatchData_default,
  baseMatches_default,
  baseMatchesProperty_default,
  baseProperty_default,
  property_default,
  baseIteratee_default
};
//# sourceMappingURL=chunk-WMBXHCIP.js.map
