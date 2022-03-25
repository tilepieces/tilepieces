function recorsiveUncheck(components, checked) {
  if(components){
    for(var k in components){
      var c = components[k];
      c.checked = checked;
      recorsiveUncheck(c.components, checked)
    }
  }
}

localComponents.addEventListener("componentsChecked", e => {
  var checked = e.detail.target.checked;
  localComponentsUIMOdel.componentsChecked = checked;
  recorsiveUncheck(localComponentsUIMOdel.localComponents, checked)
  //localComponentsUITemplate.set("", localComponentsUIMOdel);
});
globalComponents.addEventListener("componentsChecked", e => {
  var checked = e.detail.target.checked;
  globalComponentsUIMOdel.componentsChecked = checked;
  //globalComponentsUIMOdel.globalComponents.forEach(v=>v.checked = checked);
  recorsiveUncheck(globalComponentsUIMOdel.globalComponents, checked)
  //globalComponentsUITemplate.set("", globalComponentsUIMOdel);
});

function changeComponentsCheck(e,isGlobal) {
  if (!e.target.classList.contains("package-name"))
    return;
  var checked = e.target.checked;
  var component = e.target.__project;
  component.checked = checked;
  recorsiveUncheck(component.components, checked)
  if(isGlobal)
      return;
  var splitted = component.name.split("/");
  if(splitted.length > 1 && checked){
    var isLocal = localComponents.contains(e.target);
    splitted.pop();
    var startComponents = isLocal ? localComponentsUIMOdel.localComponents : null;
    var start;
    splitted.forEach((v,i,a)=>{
      var name = a.slice(0,i+1).join("/");
      start = startComponents.find(c=>c.name==name);
      start.checked = true;
      startComponents = start.components;
    })
    localComponentsUITemplate.set("", localComponentsUIMOdel);
  }
}

localComponents.addEventListener("change", e => {
  changeComponentsCheck(e);
  localComponentsUITemplate.set("", localComponentsUIMOdel);
});
globalComponents.addEventListener("change", e => {
  changeComponentsCheck(e,true);
  globalComponentsUITemplate.set("", globalComponentsUIMOdel);
});