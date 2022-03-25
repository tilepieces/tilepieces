const rgbaRegex = /rgb.?\(([^)]*)\)/;
const hslRegex = /hsl.?\(([^)]*)\)/;
const hexRegex = /#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})/;
const numberRegex = /[+-]?\d+(?:\.\d+)?|[+-]?\.\d+?/;
const numberRegexGlobal = /[+-]?\d+(?:\.\d+)?|[+-]?\.\d+?/g;
const angleTypes = /deg(\s|$)|rad(\s|$)|turn(\s|$)|grad(\s|$)/;
const numAndValueRegex = /([+-]?\d+(?:\.\d+)?|[+-]?\.\d+?)(em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr|%)/;
const cssUnitsRegex = /em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr|%/;
//let colorRegex = /rgb\([^)]*\)|rgba\([^)]*\)|#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|hsl\([^)]*\)|hsla\([^)]*\)/g;
let parenthesisToAvoid = /rgb\([^)]*\)|rgba\([^)]*\)|hsl\([^)]*\)|hsla\([^)]*\)|url\([^)]*\)/;
let sideOrCorner = /top|bottom|left|right/;
let sideOrCornerMap = {
  top: 0,
  left: 270,
  right: 90,
  bottom: 180,
  topleft: 315,
  topright: 45,
  bottomright: 135,
  bottomleft: 225
};
let opener = window.opener || window.parent || window.top;
let app = opener.app;
let TT = opener.TT;

function GradientView(view, model, noInputCss) {
  this.gradientDOM = view;
  this.noInputCss = noInputCss;
  this.gradientImage = this.gradientDOM.querySelector(".gradient-image");
  this.colorStops = this.gradientDOM.querySelector(".color-stops");
  this.colorInterpolationSlider = this.gradientDOM.querySelector(".color-interpolation-slider");
  this.parameters = this.gradientDOM.querySelector(".parameters");
  var knobEl = this.gradientDOM.querySelector(".knob");
  this.knob = new DOMKnob(knobEl);
  this.model = model ? adjustModel(model, this) : {
    parameters: "",
    colorStops: [],
    declarationForView: "",
    gradientType: ""
  };
  this.parameters.textContent = this.model.parameters;
  this.stopPointDragged = false;
  this.t = new TT(view, this.model);
  removePointerEvents(this);
  addPointer(this);
  moveColorStops(this);
  dragStopEnds(this);
  handleParamsChange(this);
  this.knob.onChange(degree => {
    if (!this.model.declarationForView)
      return;
    this.t.set("parameters", degree + "deg");
    this.parameters.dispatchEvent(new Event("blur"));
    //this.parameters.textContent = degree + "deg";
    getImageFromModel(this)
  });
  return this;
};
window.gradientView = function (view, model) {
  return new GradientView(view, model)
};