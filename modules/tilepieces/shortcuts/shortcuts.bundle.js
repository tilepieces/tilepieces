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
function keydown($self, e) {
  if ($self.options.firingOnlyAtTarget && e.target !== $self.target && !$self.target.contains(e.target))
    return;
  if ($self.options.preventDefault)
    e.preventDefault();
  if ($self.options.preventDefaultOnMeta &&
    (e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.metaKey)
  )
    e.preventDefault();
  $self.events.dispatch("down", e);
}
function keyup($self, e) {
  if ($self.options.firingOnlyAtTarget && e.target !== $self.target && !$self.target.contains(e.target))
    return;
  var match;
  try {
    match = $self.options.exclude && e.target.matches($self.options.exclude)
  } catch (e) {
  }
  if (match)
    return;
  if ($self.options.preventDefault)
    e.preventDefault();
  else if ($self.options.preventDefaultOnMeta &&
    (e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.metaKey)
  )
    e.preventDefault();
  if (e.ctrlKey || e.metaKey)
    switch (e.key) {
      case "c":
      case "C":
        $self.events.dispatch("copy", e);
        break;
      case "v":
      case "V":
        $self.events.dispatch("paste", e);
        break;
      case "x":
      case "X":
        $self.events.dispatch("cut", e);
        break;
      case "y":
      case "Y":
        $self.events.dispatch("redo", e);
        break;
      case "z":
      case "Z":
        $self.events.dispatch("undo", e);
        break;
      default:
        break;
    }
  if (e.altKey)
    switch (e.key) {
      case "ArrowLeft":
        $self.events.dispatch("redo", e);
        break;
      case "ArrowRight":
        $self.events.dispatch("undo", e);
        break;
      default:
        break;
    }
  if (!e.altKey && !e.ctrlKey)
    switch (e.key) {
      case "Delete":
        $self.events.dispatch("delete", e);
        break;
      case "Enter":
        $self.events.dispatch("enter", e);
        break;
      case "Tab":
        $self.events.dispatch("tab", e);
        break;
      case "Backspace":
        $self.events.dispatch("backspace", e);
      default:
        break;
    }
  $self.events.dispatch("up", e);
}
function mousedown($self, e) {
  if ($self.options.firingOnlyAtTarget && e.target !== $self.target && !$self.target.contains(e.target))
    return;
  if ($self.options.preventDefault)
    e.preventDefault();
  if (e.ctrlKey)
    $self.events.dispatch("selection", e);
  if (e.shiftKey)
    $self.events.dispatch("multiselection", e);

  $self.events.dispatch("click", e);
}
