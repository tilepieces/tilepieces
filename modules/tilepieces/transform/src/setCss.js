function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = app.core.setCss(target, name, value);
  console.log("setcss name,value", name, value, setCss);
  console.log("setcss", setCss);
  return setCss;
}