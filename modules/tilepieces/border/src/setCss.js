function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = opener.tilepieces.core.setCss(
    target, name, value, model.selector);
  console.log("setcss", name, value);
  return setCss;
}