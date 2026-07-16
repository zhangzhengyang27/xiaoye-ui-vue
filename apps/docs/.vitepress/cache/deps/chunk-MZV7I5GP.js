import {
  AntdIcon_default
} from "./chunk-FAE2DMNG.js";
import {
  createVNode
} from "./chunk-ZZVGP4ZW.js";

// ../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/FileTwoTone.js
var FileTwoTone = { "icon": function render(primaryColor, secondaryColor) {
  return { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M534 352V136H232v752h560V394H576a42 42 0 01-42-42z", "fill": secondaryColor } }, { "tag": "path", "attrs": { "d": "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM602 137.8L790.2 326H602V137.8zM792 888H232V136h302v216a42 42 0 0042 42h216v494z", "fill": primaryColor } }] };
}, "name": "file", "theme": "twotone" };
var FileTwoTone_default = FileTwoTone;

// ../../node_modules/.pnpm/@ant-design+icons-vue@7.0.1_vue@3.5.39_typescript@7.0.2_/node_modules/@ant-design/icons-vue/es/icons/FileTwoTone.js
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var FileTwoTone2 = function FileTwoTone3(props, context) {
  var p = _objectSpread({}, props, context.attrs);
  return createVNode(AntdIcon_default, _objectSpread({}, p, {
    "icon": FileTwoTone_default
  }), null);
};
FileTwoTone2.displayName = "FileTwoTone";
FileTwoTone2.inheritAttrs = false;
var FileTwoTone_default2 = FileTwoTone2;

export {
  FileTwoTone_default2 as FileTwoTone_default
};
//# sourceMappingURL=chunk-MZV7I5GP.js.map
