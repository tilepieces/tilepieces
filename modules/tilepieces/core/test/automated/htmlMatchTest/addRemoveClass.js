function addRemoveClassTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  tilepieces.core.htmlMatch.append(body, element1);
  logOnDocument(
    assert(body.lastElementChild == element1,
      "addRemoveClass preparation ok"), "success");
  tilepieces.core.htmlMatch.addClass(element1, "style-test");
  logOnDocument(
    assert(element1.classList.contains("style-test"),
      "addRemoveClass test1 ok"), "success");
  tilepieces.core.htmlMatch.addClass(element1, "style-test2");
  logOnDocument(
    assert(element1.classList.contains("style-test2"),
      "addRemoveClass test2 ok"), "success");
  tilepieces.core.htmlMatch.removeClass(element1, "style-test2");
  logOnDocument(
    assert(!element1.classList.contains("style-test2"),
      "addRemoveClass test3 ok"), "success");
  tilepieces.core.htmlMatch.removeClass(element1, "style-test");
  logOnDocument(
    assert(element1.hasAttribute("class") &&
      element1.getAttribute("class") == "",
      "addRemoveClass test4 ok. ( in this case, classList remains)"), "success");
}