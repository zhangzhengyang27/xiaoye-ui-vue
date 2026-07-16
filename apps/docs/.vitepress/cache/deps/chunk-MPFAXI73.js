import {
  MapCache_default
} from "./chunk-ZLUQO3R2.js";

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_setCacheAdd.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
var setCacheAdd_default = setCacheAdd;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
var setCacheHas_default = setCacheHas;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_SetCache.js
function SetCache(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
var SetCache_default = SetCache;

// ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
var cacheHas_default = cacheHas;

export {
  SetCache_default,
  cacheHas_default
};
//# sourceMappingURL=chunk-MPFAXI73.js.map
