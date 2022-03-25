function setRemoveAttributeTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  tilepieces.core.htmlMatch.append(body, element1);
  logOnDocument(
    assert(body.lastElementChild == element1,
      "setRemoveAttribute preparation ok"), "success");
  tilepieces.core.htmlMatch.setAttribute(element1, "class", "style-test");
  logOnDocument(
    assert(element1.classList.contains("style-test"),
      "setRemoveAttribute test1 ok"), "success");
  tilepieces.core.htmlMatch.removeAttribute(element1, "class");
  logOnDocument(
    assert(!element1.hasAttribute("class"),
      "setRemoveAttribute test2 ok"), "success");
  tilepieces.core.htmlMatch.setAttribute(element1, "data-class", "style-test");
  logOnDocument(
    assert(element1.getAttribute("data-class") == "style-test",
      "setRemoveAttribute test3 ok"), "success");
  tilepieces.core.htmlMatch.removeAttribute(element1, "data-class");
  logOnDocument(
    assert(!element1.hasAttribute("data-class"),
      "setRemoveAttribute test4 ok"), "success");
}