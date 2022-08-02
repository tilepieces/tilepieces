// same regex from cssSpecificity component // TODO create a unique point
const idMatch = /#[_a-zA-Z0-9-]+/g;
const elementMatch =/(\s+|^|\*|\+|>|~|\|\|)[_a-zA-Z0-9-]+/g;
function newShtModel(currentSelector){
  var model = {};
  var target = app.elementSelected;
  var classList = target.classList.length;
  var lastSelector = currentSelector.split(",").pop().trim();
  model.nodes = app.selectorObj.composedPath.reduce((acc,v)=>{
    if(v.tagName){
      acc.push(v);
    }
    return acc;
  },[]);
  model.nodes = model.nodes.map((v,i)=>{
    var nodeModel = {};
    nodeModel.index = i;
    nodeModel.ancestor = v != target;
    var elementMatchingSelector = "";
    if(lastSelector && v.matches(lastSelector)){
      var lastSelectorArray = lastSelector.split(/\s+/);
      elementMatchingSelector = lastSelectorArray.pop();
      lastSelector = lastSelectorArray.join(" ")
    }
    nodeModel.tagName = {checked:elementMatchingSelector.match(elementMatch),value:v.tagName.toLowerCase()};
    nodeModel.id = {checked:elementMatchingSelector.match(idMatch),value:v.id ? "#"+v.id : ""};
    nodeModel.elementRepresentation = createElementRepresentation(v);
    nodeModel.classes = {value:[...v.classList].map(v=>{
        return {checked:elementMatchingSelector.match(new RegExp("\\."+v+"(\\s|,|$|#|\\[|\\.)")),value:"."+v}
      })};
    nodeModel.classes.checked = nodeModel.classes.value.every(v=>v.checked);
    nodeModel.attributes = {value:[...v.attributes].map(attr=>{
        var selectorModel = `[${attr.nodeName}${attr.nodeValue.length ? `="${attr.nodeValue}"` : ""}]`
        return {checked:elementMatchingSelector.indexOf(selectorModel)>=0,value:selectorModel}
      })};
    nodeModel.attributes.checked = nodeModel.attributes.value.every(v=>v.checked);
    return nodeModel;
  });
  return model;
}