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
