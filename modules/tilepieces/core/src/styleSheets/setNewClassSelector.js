TilepiecesCore.prototype.setNewClassSelector = function (el) {
  var $self = this;
  var selectorText = "";
  var classMatch = new RegExp(`${tilepieces.classGenerator}\\d+$`);
  [...el.classList].forEach(v => {
    if (v.match(classMatch))
      selectorText = "." + v
  });
  if (!selectorText) {
    $self.classIndex += 1;
    var newClass = tilepieces.classGenerator + $self.classIndex;
    selectorText = "." + newClass;
    $self.htmlMatch.addClass(el, selectorText);
  }
  return selectorText;
};