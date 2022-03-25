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