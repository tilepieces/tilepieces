function getProp(name, _default) {
  return model._properties[name] ? model._properties[name].value : (_default || model._styles[name]);
}