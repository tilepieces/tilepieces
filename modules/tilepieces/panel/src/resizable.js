function resizable($self) {
  var el = $self.panelElement;
  if (el.querySelector(".resizable-element"))
    return;
  var resizableTemplate = `<div class="nw resizable-element"></div>
    <div class="n resizable-element"></div>
    <div class="ne resizable-element"></div>
    <div class="e resizable-element"></div>
    <div class="se resizable-element"></div>
    <div class="s resizable-element"></div>
    <div class="sw resizable-element"></div>
    <div class="w resizable-element"></div>`;
  el.insertAdjacentHTML("beforeend", resizableTemplate);
  var n = el.querySelector(".n");
  var e = el.querySelector(".e");
  var w = el.querySelector(".w");
  var s = el.querySelector(".s");
  var nw = el.querySelector(".nw");
  var sw = el.querySelector(".sw");
  var se = el.querySelector(".se");
  var ne = el.querySelector(".ne");
  var dragSettings = {
    preventMouseOut: true,
    grabCursors: false,
    grabbingClass: false
  };
  // S
  var sDrag = __drag(s, dragSettings);
  sDrag.on("down", (e) => registerPointDown(e, $self, "s"));
  sDrag.on("move", (e) => moveS(e, $self));
  sDrag.on("up", (e) => moveUp($self));
  $self.preventMouseOut = sDrag.preventMouseOut;
  // E
  var eDrag = __drag(e, dragSettings);
  eDrag.on("down", (e) => registerPointDown(e, $self, "e"));
  eDrag.on("move", (e) => moveE(e, $self));
  eDrag.on("up", (e) => moveUp($self));
  // SE
  var seDrag = __drag(se, dragSettings);
  seDrag.on("down", (e) => registerPointDown(e, $self, "se"));
  seDrag.on("move", (e) => {
    moveS(e, $self);
    moveE(e, $self);
  });
  seDrag.on("up", (e) => moveUp($self));
  // N
  var nDrag = __drag(n, dragSettings);
  nDrag.on("down", (e) => registerPointDown(e, $self, "n"));
  nDrag.on("move", (e) => moveN(e, $self));
  nDrag.on("up", (e) => moveUp($self));
  // W
  var wDrag = __drag(w, dragSettings);
  wDrag.on("down", (e) => registerPointDown(e, $self, "w"));
  wDrag.on("move", (e) => moveW(e, $self));
  wDrag.on("up", (e) => moveUp($self));
  // NW
  var nwDrag = __drag(nw, dragSettings);
  nwDrag.on("down", (e) => registerPointDown(e, $self, "nw"));
  nwDrag.on("move", (e) => {
    moveN(e, $self);
    moveW(e, $self);
  });
  nwDrag.on("up", (e) => moveUp($self));
  // SW
  var swDrag = __drag(sw, dragSettings);
  swDrag.on("down", (e) => registerPointDown(e, $self, "sw"));
  swDrag.on("move", (e) => {
    moveS(e, $self);
    moveW(e, $self);
  });
  swDrag.on("up", (e) => moveUp($self));
  // NE
  var neDrag = __drag(ne, dragSettings);
  neDrag.on("down", (e) => registerPointDown(e, $self, "ne"));
  neDrag.on("move", (e) => {
    moveN(e, $self);
    moveE(e, $self);
  });
  neDrag.on("up", (e) => moveUp($self));
}