function detectNewClass(selectorText = ""){
  var app = window.tilepieces;
  var selSplitted = selectorText.split(",");
  selSplitted.forEach(v=>{
    v = v.trim();
    if(v.match(app.utils.regexOneClassInSelector)) {
      var className = v.replace(".","");
      !app.core.styles.classes.includes(className) && app.core.styles.classes.push(className)
    }
  })
}