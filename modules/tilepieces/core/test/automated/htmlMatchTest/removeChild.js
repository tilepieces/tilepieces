function removeChildTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  tilepieces.core.htmlMatch.append(body, element1);
  tilepieces.core.htmlMatch.addClass(element1, "remove-child-element");
  logOnDocument(
    assert(body.lastElementChild == element1 &&
      element1.classList.contains("remove-child-element"),
      "removeChild preparation ok"), "success");
  tilepieces.core.htmlMatch.removeChild(element1);
  logOnDocument(
    assert(!doc.documentElement.contains(element1),
      "removeChild ok"), "success");
}