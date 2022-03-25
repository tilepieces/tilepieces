function contenteditable2Test() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var wrapperElement = doc.createElement("section");
  var element1 = doc.createElement("div");
  wrapperElement.append(element1);
  tilepieces.core.htmlMatch.append(body, wrapperElement);
  logOnDocument(
    assert(body.lastElementChild == wrapperElement,
      "contenteditable2 preparation ok"), "success");
  var html = `<a href="#">an <b>a</b> <i>tag</i></a>`;
  tilepieces.core.htmlMatch.innerHTML(element1, html);
  logOnDocument(
    assert(element1.innerHTML == html,
      "contenteditable2 preparation 2 ok"), "success");
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
      "contenteditable2 test1 ok"), "success");
  tilepieces.core.htmlMatch.outerHTML(element1, "a complete new node");
  logOnDocument(
    assert(
      wrapperElement.innerHTML == "a complete new node",
      "contenteditable2 test2 ok"), "success");
  var ce = tilepieces.core.htmlMatch.contenteditable(wrapperElement);
  logOnDocument(
    assert(
      wrapperElement.hasAttribute("contenteditable"),
      "contenteditable2 test2 ok"), "success");
  wrapperElement.innerHTML = "a <b>contenteditable</b> change";
  var en = new KeyboardEvent("input", {bubbles: true});
  wrapperElement.dispatchEvent(en);
  ce.destroy();
  var match = tilepieces.core.htmlMatch.find(wrapperElement);
  logOnDocument(
    assert(match &&
      match.attributes &&
      match.HTML &&
      match.match &&
      match.match.innerHTML == "a <b>contenteditable</b> change" &&
      !wrapperElement.hasAttribute("contenteditable") &&
      !match.match.hasAttribute("contenteditable"),
      "contenteditable2 test2 ok"), "success");
}