function moveTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var element1 = doc.createElement("div");
  element1.className = "element-1";
  var element2 = doc.createElement("div");
  element2.className = "element-2";
  var element3 = doc.createElement("div");
  element3.className = "element-3";
  var element4 = doc.createElement("div");
  element4.className = "element-4";
  element2.append(element4);
  tilepieces.core.htmlMatch.append(body, element1);
  tilepieces.core.htmlMatch.append(body, element2);
  tilepieces.core.htmlMatch.append(body, element3);
  logOnDocument(
    assert(
      body.firstElementChild == element1 &&
      body.children[1] == element2 &&
      element2.firstElementChild == element4 &&
      body.lastElementChild == element3,
      "moveTest preparation ok"), "success");
  tilepieces.core.htmlMatch.move(element1, element3, "before");
  logOnDocument(
    assert(
      body.firstElementChild == element3 &&
      body.children[1] == element1 &&
      element2.firstElementChild == element4 &&
      body.lastElementChild == element2,
      "move test1 ok"), "success");
  tilepieces.core.htmlMatch.move(element1, element4, "prepend");
  logOnDocument(
    assert(
      body.firstElementChild == element3 &&
      body.children[1] == element1 &&
      element1.firstElementChild == element4 &&
      !element2.firstElementChild &&
      body.lastElementChild == element2,
      "move test2 ok"), "success");
  tilepieces.core.htmlMatch.move(element2, element1, "after");
  logOnDocument(
    assert(
      body.firstElementChild == element3 &&
      body.children[1] == element2 &&
      element1.firstElementChild == element4 &&
      body.lastElementChild == element1,
      "move test3 ok"), "success");
  tilepieces.core.htmlMatch.move(element3, element4, "append");
  logOnDocument(
    assert(
      body.firstElementChild == element3 &&
      body.children[1] == element2 &&
      element3.firstElementChild == element4 &&
      !element1.firstElementChild &&
      body.lastElementChild == element1,
      "move test3 ok"), "success");

}