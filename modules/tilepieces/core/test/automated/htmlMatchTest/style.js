function styleTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  tilepieces.core.htmlMatch.append(body, element1);
  tilepieces.core.htmlMatch.setAttribute(element1, "class", "style-test");
  logOnDocument(
    assert(body.lastElementChild == element1 &&
      element1.classList.contains("style-test"),
      "style preparation ok"), "success");
  tilepieces.core.htmlMatch.style(element1, "color", "red");
  logOnDocument(
    assert(element1.style.color == "red",
      "style test1 ok"), "success");
  tilepieces.core.htmlMatch.style(element1, "color", "red", "important");
  logOnDocument(
    assert(element1.style.getPropertyPriority("color") == "important",
      "style test2 ok"), "success");
}