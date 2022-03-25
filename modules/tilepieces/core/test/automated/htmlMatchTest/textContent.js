function textContentTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  element1.className = "text-content-1";
  tilepieces.core.htmlMatch.append(body, element1);
  logOnDocument(
    assert(body.lastElementChild == element1,
      "style preparation ok"), "success");
  tilepieces.core.htmlMatch.textContent(element1, "an element");
  logOnDocument(
    assert(element1.textContent == "an element",
      "textContent test1 ok"), "success");
  tilepieces.core.htmlMatch.textContent(element1, "an element change");
  logOnDocument(
    assert(element1.textContent == "an element change",
      "textContent test2 ok"), "success");
}