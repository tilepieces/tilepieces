function afterBeforeAppendPrependTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  var cloneNode1 = element1.cloneNode();
  var cloneNode2 = element1.cloneNode();
  var cloneNode3 = element1.cloneNode();
  var element2 = doc.createElement("section");
  var element3 = doc.createElement("header");
  var element4 = doc.createElement("footer");
  var element5 = doc.createElement("article");
  var documentFragment1 = doc.createDocumentFragment();
  documentFragment1.append(element1);
  var documentFragment2 = doc.createDocumentFragment();
  documentFragment2.append(cloneNode1);
  var documentFragment3 = doc.createDocumentFragment();
  documentFragment3.append(cloneNode2);
  var documentFragment4 = doc.createDocumentFragment();
  documentFragment4.append(cloneNode3);
  tilepieces.core.htmlMatch.prepend(body, element2);
  logOnDocument(
    assert(body.firstElementChild == element2,
      "insertAdjacentElement 'prepend' test"), "success");
  tilepieces.core.htmlMatch.prepend(body, documentFragment1);
  logOnDocument(
    assert(body.firstElementChild == element1,
      "insertAdjacentElement 'prepend' document fragment test"), "success");

  tilepieces.core.htmlMatch.before(element1, element3);
  logOnDocument(
    assert(body.firstElementChild == element3,
      "insertAdjacentElement 'before' test"), "success");
  tilepieces.core.htmlMatch.before(element3, documentFragment2);
  logOnDocument(
    assert(body.firstElementChild == cloneNode1,
      "insertAdjacentElement 'before' document fragment test"), "success");

  tilepieces.core.htmlMatch.append(body, element4);
  logOnDocument(
    assert(body.lastElementChild == element4,
      "insertAdjacentElement 'append' test"), "success");
  tilepieces.core.htmlMatch.append(body, documentFragment3);
  logOnDocument(
    assert(body.lastElementChild == cloneNode2,
      "insertAdjacentElement 'append' document fragment test"), "success");

  tilepieces.core.htmlMatch.after(cloneNode2, element5);
  logOnDocument(
    assert(body.lastElementChild == element5,
      "insertAdjacentElement 'after' test"), "success");
  tilepieces.core.htmlMatch.after(element5, documentFragment4);
  logOnDocument(
    assert(body.lastElementChild == cloneNode3,
      "insertAdjacentElement 'after' document fragment test"), "success");
}