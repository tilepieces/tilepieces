// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
var defaults = {
  preventDefault: false,
  preventDefaultOnMeta: true,
  firingOnlyAtTarget: false,
  exclude: ""
};
window.Shortcuts = function (domEl, options = {}) {
  var $self = this;
  $self.target = domEl;
  $self.events = events();
  $self.on = $self.events.on;
  $self.options = Object.assign(defaults, options);
  var kup = (e) => keyup($self, e);
  //var kdown = (e)=>keydown($self,e);
  var mdown = (e) => mousedown($self, e);
  domEl.ownerDocument.addEventListener("keydown", kup);
  //document.addEventListener("keydown",kdown);
  domEl.addEventListener("click", mdown);
  $self.destroy = function () {
    domEl.ownerDocument.removeEventListener("keydown", kup);
    //document.removeEventListener("keydown",kdown);
    domEl.removeEventListener("click", mdown);
  };
  return $self;
}