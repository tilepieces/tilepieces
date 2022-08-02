selectorHelperTrigger.addEventListener("click",e=>{
  var isActive = selectorHelperView.classList.toggle("show");
  if(isActive){
    shtModel = newShtModel(model.currentSelector);
    selectorHelperTrigger.src = "/modules/tilepieces/stylesheet/svg-close.svg"
    sht.set("",shtModel);
  }
  else{
    selectorHelperTrigger.src = "/modules/tilepieces/stylesheet/svg-summary.svg"
  }
})
let sht = new opener.TT(selectorHelperTemplate, shtModel);
selectorHelperView.addEventListener("change",e=>{
  var t = e.target;
  var index = t.dataset.index || 0;
  var node = shtModel.nodes[+index];
  var isClass = t.dataset.bind == "node.classes.checked";
  var isAttrs = t.dataset.bind == "node.attributes.checked";
  var closestClass = t.closest("[data-if='node.classes.value.length']");
  var closestAttr = t.closest("[data-if='node.attributes.value.length']");
  var valued = false;
  if(isClass || isAttrs){
    isClass && node.classes.value.forEach(v=>v.checked = t.checked);
    isAttrs && node.attributes.value.forEach(v=>v.checked = t.checked);
    valued = true;
  }
  if(closestClass &&
    node.classes.value.length == 1) {
    node.classes.checked = t.checked;
    valued = true;
  }
  if(closestAttr &&
    node.attributes.value.length == 1) {
    node.attributes.checked = t.checked;
    valued = true;
  }
  if(valued){
    sht.set("",shtModel);
    updateSelector();
  }
})
function updateSelector(){
  model.currentSelector = shtModel.nodes.slice(0).reverse().reduce((acc,v,i)=>{
    var tagName = v.tagName.checked ? v.tagName.value : "";
    var id = v.id.checked ? v.id.value : "";
    var classes = v.classes.value.map(c=>c.checked ? c.value : "").join("");
    var attributes = v.attributes.value.map(c=>c.checked ? c.value : "").join("");
    var sel = `${tagName}${id}${classes}${attributes}`
    if(i > 0 && sel) sel = " " + sel;
    return sel ? acc + sel : acc;
  },"")
  t.set("currentSelector",model.currentSelector);
}
selectorHelperTemplate.addEventListener("template-digest",updateSelector)