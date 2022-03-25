function unitConverter(type, cssProperty, elStyles, parentStyles) {
  switch (type) {
    case "px":
      return elStyles[cssProperty];
    case "%":
      var pxValue = elStyles[cssProperty].match(regexNumbers);
      var parentPxValue;
      if (cssProperty == "top" || cssProperty == "left" ||
        cssProperty == "width")
        parentPxValue = parentStyles["width"].match(regexNumbers);
      else
        parentPxValue = parentStyles["height"].match(regexNumbers);
      // pxValue : parentPxValue = % : 100 -> % = ( 100 * pxValue ) / parentPxValue
      var p = (100 * pxValue) / parentPxValue;
      return p + "%";
  }
}