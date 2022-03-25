function replaceWithTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  element1.className = "replace-with-1";
  var element2 = doc.createElement("div");
  element2.className = "replace-with-2";
  tilepieces.core.htmlMatch.append(body, element1);
  logOnDocument(
    assert(body.lastElementChild == element1,
      "replaceWith test1 ok"), "success");
  tilepieces.core.htmlMatch.replaceWith(element1, element2);
  logOnDocument(
    assert(body.lastElementChild == element2 &&
      !doc.documentElement.contains(element1),
      "replaceWith test2 ok"), "success");
}