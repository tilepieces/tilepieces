(()=>{
const opener = window.opener || window.parent;
let app = opener.tilepieces;
window.cssDefaults = app.cssDefaultValues;
const appView = document.getElementById("layout-box");
var model = {
  hideClass: "hide",
  gridAreasTemplate: [],
  positionLinked: "selected",
  borderLinked: "selected",
  marginLinked: "selected",
  paddingLinked: "selected"
};
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("", {isVisible: false});
});
opener.addEventListener("frame-unload", e => {
  t.set("", {isVisible: false});
});
autocomplete(appView);
let t = new opener.TT(appView, model);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});

tilepieces_tabs({
  el: document.getElementById("tab-layout")
})

function getProp(name, _default) {
  return model._properties[name] ? model._properties[name].value : (_default || model._styles[name]);
}
function setFlexIcon(name,value) {
  var wrapper = appView.querySelector(`.flex-icons[data-key="${name}"]`);
  var sel = wrapper.querySelector("button.selected");
  sel && sel.classList.remove("selected");
  var buttonToSelect = wrapper.querySelector(`button[data-value="${value}"]`);
  buttonToSelect && buttonToSelect.classList.add("selected");
}
function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = app.core.setCss(target, name, value);
  console.log("setcss", name, value);
  return setCss;
}
function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  model.match = d.match;
  model.isVisible = true;
  model._properties = d.cssRules.properties;
  model._styles = d.styles;
  model.elementPresent = d.target;
  model.fatherStyle = d.fatherStyle || {display: "none"}; // HTML TAG HAS NO FATHER
  var fatherStyle = model.fatherStyle;
  model.display = getProp("display");
  var display = d.styles.display;
  model.multiColumnLayout = d.styles.columns != "auto auto" && d.styles.columns != "auto";
  model.inlineStyles = display == 'inline' || display == 'inline-block' || display == 'table-cell';
  model.gridContainer = display == 'grid' || display == 'inline-grid';
  model.flexContainer = display == 'flex' || display == 'inline-flex';
  model.flexOrGridContainer = model.gridContainer || model.flexContainer;
  model.flexOrGridOrMultiContainer = model.gridContainer || model.flexContainer || model.multiColumnLayout
  if (model.inlineStyles) {
    model.verticalAlign = getProp("vertical-align");
  }
  model.listStyle = display == 'list-item' || d.target.nodeName == "UL" || d.target.nodeName == "OL";
  if (model.listStyle) {
    model.listStyleType = getProp("list-style-type");
    model.listStylePosition = getProp("list-style-position");
    model.listStyleImage = getProp("list-style-image");
  }
  model.displayBlock = display == 'block' || display == 'inline-block';
  if (model.displayBlock) {
    model.clear = getProp("clear");
  }
  if (model.flexContainer) {
    model.alignContent = getProp("align-content");
    setFlexIcon("align-content",model.alignContent);
    model.flexDirection = getProp("flex-direction");
    setFlexIcon("flex-direction",model.flexDirection);
    model.flexWrap = getProp("flex-wrap");
    setFlexIcon("flex-wrap",model.flexWrap);
    model.justifyContent = getProp("justify-content");
    setFlexIcon("justify-content",model.justifyContent);
  }
  model.alignItems = getProp("align-items");
  setFlexIcon("align-items",model.alignItems);
  model.flexOrGridChildren = fatherStyle.display == 'flex' || fatherStyle.display == 'inline-flex' || fatherStyle.display == 'grid';
  if (model.flexOrGridChildren) {
    model.alignSelf = getProp("align-self");
  }
  model.flexChildren = fatherStyle.display == 'flex' || fatherStyle.display == 'inline-flex';
  if (model.flexChildren) {
    model.flexBasis = getProp("flex-basis");
    model.flexGrow = getProp("flex-grow");
    model.flexShrink = getProp("flex-shrink");
    model.order = getProp("order");
  }
  model.tableContainer = display == 'table' || display == 'inline-table';
  model.borderSpacingAllowed = false;
  if (model.tableContainer) {
    model.borderCollapse = getProp("border-collapse");
    model.borderSpacingAllowed = d.styles.borderCollapse != "collapse";
    if (model.borderSpacingAllowed)
      model.borderSpacing = getProp("border-spacing");
    model.tableLayout = getProp("table-layout");
    model.captionSide = getProp("caption-side");
  }
  model.emptyCellsAllowed = false;
  var tableParent = d.target.closest("table");
  if (tableParent) {
    model.emptyCellsAllowed = tableParent &&
      tableParent.ownerDocument.defaultView.getComputedStyle(tableParent).borderCollapse == "separate";
    if (model.emptyCellsAllowed)
      model.emptyCells = getProp("empty-cells");
  }
  model.gridChildren = fatherStyle.display == 'grid' || fatherStyle.display == 'inline-grid';
  model.columnGap = getProp("column-gap");
  model.rowGap = getProp("row-gap");
  if (model.gridContainer) {
    model.gridAreasTemplate = gridTemplateAssignment(d);
    model.gridTemplateColumns = getProp("grid-template-columns");
    model.gridTemplateRows = getProp("grid-template-rows");
    model.gridAutoColumns = getProp("grid-auto-columns");
    model.gridAutoFlow = getProp("grid-auto-flow");
    model.gridAutoRows = getProp("grid-auto-rows");
  } else model.gridAreasTemplate = [];
  if (model.gridChildren) {
    model.gridArea = getProp("grid-area");
    model.gridColumnStart = getProp("grid-column-start");
    model.gridColumnEnd = getProp("grid-column-end");
    model.gridRowStart = getProp("grid-row-start");
    model.gridRowEnd = getProp("grid-row-end");
  }
  model.float = getProp("float");
  model.position = getProp("position");
  model.positionVisible = d.styles.position != "static";
  model.top = getProp("top", "0px");//d.styles.top;
  model.left = getProp("left", "0px");
  model.right = getProp("right", "0px");
  model.bottom = getProp("bottom", "0px");
  model.marginTop = getProp("margin-top");
  model.marginLeft = getProp("margin-left");
  model.marginRight = getProp("margin-right");
  model.marginBottom = getProp("margin-bottom");
  model.borderTopWidth = getProp("border-top-width");
  model.borderLeftWidth = getProp("border-left-width");
  model.borderRightWidth = getProp("border-right-width");
  model.borderBottomWidth = getProp("border-bottom-width");
  model.paddingTop = getProp("padding-top");
  model.paddingLeft = getProp("padding-left");
  model.paddingRight = getProp("padding-right");
  model.paddingBottom = getProp("padding-bottom");
  model.objectEl = d.target.nodeName == 'IMG' || d.target.nodeName == 'VIDEO';
  model.objectFit = getProp("object-fit");
  model.objectPosition = getProp("object-position");
  model.width = getProp("width");
  model.maxWidth = getProp("max-width");
  model.minWidth = getProp("min-width");
  model.height = getProp("height");
  model.maxHeight = getProp("max-height");
  model.minHeight = getProp("min-height");
  model.boxSizing = getProp("box-sizing");
  model.visibility = getProp("visibility");
  model.opacity = getProp("opacity");
  model.overflow = getProp("overflow");
  model.overflowX = getProp("overflowX");
  model.overflowY = getProp("overflowY");
  model.cursor = getProp("cursor");

  model.calculatedWidth = model._styles.width;
  model.calculatedHeight = model._styles.height;
  t.set("", model);
  inputCss(appView);
}

appView.querySelector("#show-measure")
  .addEventListener("click", e => {
    if (!e.target.closest("button"))
      return;
    var propType = e.target.closest("div").id;
    var isSelected = e.target.closest(".label").classList.contains("selected");
    model[propType + "Linked"] = isSelected ? "" : "selected";
    t.set("", model);
  });
appView.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.dataset.cssProp && target.value) {
    setCss(target.dataset.cssProp, target.value);
    inputCss(appView);
  }
}, true);
/*
appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  var prop = e.target.dataset.cssProp;
  if (prop.match(/^(margin|padding|border)/) && e.target.dataset.linked) {
    if (prop.startsWith("margin")) {
      model.marginTop = e.target.innerText;
      model.marginLeft = e.target.innerText;
      model.marginRight = e.target.innerText;
      model.marginBottom = e.target.innerText;
    }
    if (prop.startsWith("padding")) {
      model.paddingTop = e.target.innerText;
      model.paddingLeft = e.target.innerText;
      model.paddingRight = e.target.innerText;
      model.paddingBottom = e.target.innerText;
    }
    if (prop.startsWith("border")) {
      model.borderTopWidth = e.target.innerText;
      model.borderLeftWidth = e.target.innerText;
      model.borderRightWidth = e.target.innerText;
      model.borderBottomWidth = e.target.innerText;
    }
    t.set("", model);
    inputCss(appView);
    flagCssInputSetText = true;
  }
}, true);*/
appView.addEventListener("focus", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  e.target.parentNode.classList.add("focus");
}, true);
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  e.target.parentNode.classList.remove("focus");
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
appView.addEventListener("input", e => {
  var target = e.target;
  if (!target.classList.contains("input-css"))
    return;
  var prop = target.dataset.cssProp;
  if (prop) {
    var value = target.innerText;
    if (e.target.dataset.value == e.target.innerText)
      return;
    if (prop.startsWith("margin") && target.dataset.linked) {
      prop = "margin";
    }
    if (prop.startsWith("padding") && target.dataset.linked) {
      prop = "padding";
    }
    if (prop.startsWith("border") && target.dataset.linked) {
      prop = "border-width";
    }
    setCss(prop, value);
    if (prop.match(/^(margin|padding|border)/) && e.target.dataset.linked) {
      if (prop.startsWith("margin")) {
        model.marginTop = value;
        model.marginLeft = value;
        model.marginRight = value;
        model.marginBottom = value;
      }
      if (prop.startsWith("padding")) {
        model.paddingTop = value;
        model.paddingLeft = value;
        model.paddingRight = value;
        model.paddingBottom = value;
      }
      if (prop.startsWith("border")) {
        model.borderTopWidth = value;
        model.borderLeftWidth = value;
        model.borderRightWidth = value;
        model.borderBottomWidth = value;
      }
      t.set("", model);
      inputCss(appView);
    }
  }
}, true);
appView.addEventListener("click",e=>{
  var iconsWrapper = e.target.closest(".flex-icons")
  if(!iconsWrapper)
      return;
  var key = iconsWrapper.dataset.key;
  var valueButton = e.target.closest("button")
  if(!valueButton)
    return;
  var value = valueButton.dataset.value;
  setCss(key,value);
  var selected = iconsWrapper.querySelector(".selected")
  selected && selected.classList.remove("selected");
  valueButton.classList.add("selected")
  var prop = iconsWrapper.dataset.cssPropJs;
  t.set(prop, value);
  inputCss(appView);
})
function gridTemplateAssignment(d) {
  var areas = d.styles.gridTemplateAreas;
  var gridAreasTemplate;
  if (areas && areas != "none") {
    var rows = areas.substring(1, areas.length - 1).split(/"\s+"/);
    gridAreasTemplate = rows.map((r, ri) => {
      var arr = r.split(/\s/);
      var cells = arr.map((v, ci) => {
        return {label: v, index: ci}
      });
      return {
        index: ri,
        cells
      }
    });
  } else gridAreasTemplate = [];
  return gridAreasTemplate;
}

function computeGridTemplateAreas() {
  if (model.gridAreasTemplate.length && model.gridAreasTemplate.find(c => c.cells.length))
    return model.gridAreasTemplate
      .map(row => `"${row.cells.map(c => c.label).join(" ")}"`).join(" ");
  else return ""
}

appView.addEventListener("change", e => {
  var target = e.target;
  if (target.hasAttribute("data-row-index")) {
    setTimeout(() => {
      setCss("grid-template-areas", computeGridTemplateAreas());
    })
  }
}, true);
appView.addEventListener("click", e => {
  var target = e.target;
  if (target.id == "add-css-grid-column") {
    var gridAreas = model.gridAreasTemplate.slice(0);
    gridAreas.forEach(row => row.cells.push({label: ".", index: i}));
    t.set("gridAreasTemplate", gridAreas);
    setCss("grid-template-areas", computeGridTemplateAreas());
  }
  if (target.id == "add-css-grid-row") {
    var gridAreas = model.gridAreasTemplate.slice(0);
    var cellsLength = gridAreas[0] ? gridAreas[0].cells.length : 1;
    var cells = [];
    for (var i = 0; i < cellsLength; i++)
      cells.push({label: ".", index: i});
    gridAreas.push({cells, index: gridAreas.length});
    t.set("gridAreasTemplate", gridAreas);
    setCss("grid-template-areas", computeGridTemplateAreas());
  }
  if (target.id == "remove-css-grid-row") {
    var gridAreas = model.gridAreasTemplate.slice(0);
    gridAreas.splice(gridAreas.length - 1, 1);
    t.set("gridAreasTemplate", gridAreas);
    setCss("grid-template-areas", computeGridTemplateAreas());
  }
  if (target.id == "remove-css-grid-column") {
    var gridAreas = model.gridAreasTemplate.slice(0);
    var cellsLength = gridAreas[0].cells.length;
    gridAreas.forEach(row => row.cells.splice(cellsLength - 1, 1));
    t.set("gridAreasTemplate", gridAreas);
    setCss("grid-template-areas", computeGridTemplateAreas());
  }
}, true);
appView.addEventListener("focus", e => {
  var prop = e.target.dataset.cssProp || "";
  if (prop.match(/^(margin|padding|border)/)) {
    if (prop.startsWith("margin")) {
      app.editElements.margin = true;
    }
    if (prop.startsWith("padding")) {
      app.editElements.padding = true;
    }
    if (prop.startsWith("border")) {
      app.editElements.border = true;
    }
  }
}, true);
appView.addEventListener("blur", e => {
  app.editElements.margin = false;
  app.editElements.padding = false;
  app.editElements.border = false;
}, true);

})();