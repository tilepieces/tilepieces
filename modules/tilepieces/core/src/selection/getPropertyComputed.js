function getPropertyComputed(computed, name) {
  var prop = +(computed.getPropertyValue(name).replace("px", ""));
  return prop < 0 ? 0 : prop;
}