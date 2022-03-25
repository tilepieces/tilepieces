function createElementRepresentation(target) {
  var myObject = [];
  var attributes = target.attributes;
  // attribute cycle to print element
  for (var i = 0; i < attributes.length; i++)
    myObject[i] = attributes[i].nodeName.toLowerCase() + "=\"" + attributes[i].nodeValue + "\"";
  return "<" + target.tagName + " " + myObject.join(" ") + " >";
}