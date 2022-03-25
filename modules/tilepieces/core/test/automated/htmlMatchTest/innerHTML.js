function innerHTMLTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  tilepieces.core.htmlMatch.append(body, element1);
  logOnDocument(
    assert(body.lastElementChild == element1,
      "innerHTML preparation ok"), "success");
  var html = `<a href="#">an <b>a</b> <i>tag</i></a>`;
  var html2 = "an a tag";
  tilepieces.core.htmlMatch.innerHTML(element1, html);
  logOnDocument(
    assert(element1.innerHTML == html,
      "innerHTML test1 ok"), "success");
  tilepieces.core.htmlMatch.innerHTML(element1, "");
  tilepieces.core.htmlMatch.innerHTML(element1, html);
  var a = element1.firstElementChild;
  tilepieces.core.htmlMatch.addClass(a, "html2");
  tilepieces.core.htmlMatch.innerHTML(a, html2);
  logOnDocument(
    assert(a.className == "html2" &&
      a.innerHTML == html2,
      "innerHTML test2 ok"), "success");
}