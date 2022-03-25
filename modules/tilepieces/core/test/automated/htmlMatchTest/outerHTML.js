function outerHTMLTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var wrapperElement = doc.createElement("section");
  var element1 = doc.createElement("div");
  wrapperElement.append(element1);
  tilepieces.core.htmlMatch.append(body, wrapperElement);
  logOnDocument(
    assert(body.lastElementChild == wrapperElement,
      "outerHTML preparation ok"), "success");
  var html = `<a href="#">an <b>a</b> <i>tag</i></a>`;
  tilepieces.core.htmlMatch.innerHTML(element1, html);
  logOnDocument(
    assert(element1.innerHTML == html,
      "outerHTML preparation 2 ok"), "success");
  tilepieces.core.htmlMatch.innerHTML(element1, "");
  tilepieces.core.htmlMatch.innerHTML(element1, html);
  var a = element1.firstElementChild;
  var b = a.firstElementChild;
  var c = a.lastElementChild;
  tilepieces.core.htmlMatch.outerHTML(b, "<i>tag</i>");
  tilepieces.core.htmlMatch.outerHTML(c, "<b>a</b>");
  logOnDocument(
    assert(
      a.innerHTML == `an <i>tag</i> <b>a</b>`,
      "outerHTML test1 ok"), "success");
  tilepieces.core.htmlMatch.outerHTML(element1, "a complete new node");
  logOnDocument(
    assert(
      wrapperElement.innerHTML == "a complete new node",
      "outerHTML test2 ok"), "success");
}