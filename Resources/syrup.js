var define_global_variable_js;
define_global_variable_js = function(name) {
  var js;
  js = "if(typeof " + name + " === 'undefined') \{ " + name + "={} \} else \{ " + name + " \}";
  return eval(js);
};
exports.namespace = function(ns, block) {
  var name, names, target, _i, _len, _ref;
  names = ns.split('.');
  target = define_global_variable_js(names[0]);
  _ref = names.slice(1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    if (!target[name]) {
      target[name] = {};
    }
    target = target[name];
  }
  return block(target);
};
exports.use = function(ns) {
  return this.namespace(ns, function(exports) {
    return exports;
  });
};
exports.include = function(file) {
  return Ti.include("" + file + ".js");
};