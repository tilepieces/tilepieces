function insertAdjacentElementTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  var element2 = doc.createElement("section");
  var element3 = doc.createElement("header");
  var element4 = doc.createElement("footer");
  var element5 = doc.createElement("article");
  var documentFragment = doc.createDocumentFragment();
  documentFragment.append(element1);
  tilepieces.core.htmlMatch.insertAdjacentElement(body, "prepend", element2);
  logOnDocument(
    assert(body.firstElementChild == element2,
      "insertAdjacentElement 'prepend' test"), "success");
  tilepieces.core.htmlMatch.insertAdjacentElement(element2, "before", element3);
  logOnDocument(
    assert(body.firstElementChild == element3,
      "insertAdjacentElement 'before' test"), "success");
  tilepieces.core.htmlMatch.insertAdjacentElement(body, "append", element4);
  logOnDocument(
    assert(body.lastElementChild == element4,
      "insertAdjacentElement 'append' test"), "success");
  tilepieces.core.htmlMatch.insertAdjacentElement(element4, "after", element5);
  logOnDocument(
    assert(body.lastElementChild == element5,
      "insertAdjacentElement 'after' test"), "success");
  tilepieces.core.htmlMatch.insertAdjacentElement(element2, "append", documentFragment);
  logOnDocument(
    assert(element2.children[0] == element1,
      "insertAdjacentElement 'append' test"), "success");
}