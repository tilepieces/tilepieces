let opener = window.opener || window.parent;
const width = document.getElementById("width");
const height = document.getElementById("height");
const fitToScreen = document.getElementById("fit-to-screen-button");
const reverse = document.getElementById("reverse");
const selectScreenDimensions = document.getElementById("screen-dimensions-default");
let tilepieces = opener.tilepieces || {};
function confrontDimensionIframeWithParent(w, h) {
  w = Math.trunc(w);
  h = Math.trunc(h);
  if (w > tilepieces.frame.parentNode.offsetWidth)
    tilepieces.frame.parentNode.style.overflowX = "scroll";
  else
    tilepieces.frame.parentNode.style.overflowX = "";
  if (h > tilepieces.frame.parentNode.offsetHeight)
    tilepieces.frame.parentNode.style.overflowY = "scroll";
  else
    tilepieces.frame.parentNode.style.overflowY = "";
  if (w == tilepieces.frame.parentNode.offsetWidth &&
    h == tilepieces.frame.parentNode.offsetHeight)
    fitToScreen.classList.add("fit-to-screen");
  else
    fitToScreen.classList.remove("fit-to-screen");

  var dimensions = selectScreenDimensions.value.split("x");
  if (dimensions[0] != w || dimensions[1] != h)
    selectScreenDimensions.value = "";
}

width.addEventListener("change", e => {
  var value = e.target.value;
  tilepieces.frame.style.width = value + "px";
  confrontDimensionIframeWithParent(+value, +height.value);
});
height.addEventListener("change", e => {
  var value = e.target.value;
  tilepieces.frame.style.height = value + "px";
  confrontDimensionIframeWithParent(+width.value, +value);
});
fitToScreen.addEventListener("click", e => {
  tilepieces.frame.style.width = "";
  tilepieces.frame.style.height = "";
  tilepieces.frame.parentNode.style.overflowY = "";
  tilepieces.frame.parentNode.style.overflowX = "";
});
reverse.addEventListener("click", e => {
  tilepieces.frame.style.width = height.value + "px";
  tilepieces.frame.style.height = width.value + "px";
  confrontDimensionIframeWithParent(+width.value, +height.value);
});
selectScreenDimensions.addEventListener("change", e => {
  var dimensions = selectScreenDimensions.value.split("x");
  var w = dimensions[0];
  var h = dimensions[1];
  tilepieces.frame.style.width = w + "px";
  tilepieces.frame.style.height = h + "px";
  confrontDimensionIframeWithParent(+w, +h);
});
opener.addEventListener("resize", () => {
  confrontDimensionIframeWithParent(+width.value, +height.value);
});
opener.addEventListener("frame-resize",e=>{
  var w = e.detail.width;
  var h = e.detail.height;
  width.value = w;
  height.value = h;
  confrontDimensionIframeWithParent(w, h);
})
var w = tilepieces.frameContentRect.width;
var h = tilepieces.frameContentRect.height;
width.value = w;
height.value = h;
confrontDimensionIframeWithParent(w, h);

