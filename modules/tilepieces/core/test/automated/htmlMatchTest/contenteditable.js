function contenteditableTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var wrapperElement = doc.createElement("section");
  var element1 = doc.createElement("div");
  var element2 = doc.createElement("div");
  wrapperElement.append(element1);
  wrapperElement.append(element2);
  tilepieces.core.htmlMatch.prepend(body, element2);
  logOnDocument(
    assert(body.firstElementChild == element2,
      "contenteditable1 preparation ok"), "success");
  tilepieces.core.htmlMatch.prepend(body, element1);
  logOnDocument(
    assert(body.firstElementChild == element1,
      "contenteditable1 preparation ok"), "success");
  var c = tilepieces.core.htmlMatch.contenteditable(element1);
  logOnDocument(
    assert(
      element1.hasAttribute("contenteditable"),
      "contenteditable1 test2 ok"), "success");
  element1.innerHTML = "a <b>contenteditable</b> change";
  var en = new KeyboardEvent("input", {bubbles: true});
  element1.dispatchEvent(en);
  c.destroy();
  var match = tilepieces.core.htmlMatch.find(element1);
  logOnDocument(
    assert(match &&
      match.attributes &&
      match.HTML &&
      match.match &&
      match.match.innerHTML == "a <b>contenteditable</b> change" &&
      !element1.hasAttribute("contenteditable") &&
      !match.match.hasAttribute("contenteditable"),
      "contenteditable1 test2 ok"), "success");
}