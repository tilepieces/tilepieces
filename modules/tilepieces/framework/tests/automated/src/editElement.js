import {compare_highlight} from './compare_highlight.js';

export async function editElement(e, cWin, cDoc, tilepieces) {
  logOnDocument("Edit element", "larger");
  var ceTrigger = cDoc.getElementById("contenteditable-trigger");
  var selectionTrigger = cDoc.getElementById("selection-trigger");
  selectionTrigger.click();
  logOnDocument(assert(
    tilepieces.editMode == "selection",
    "tilepieces.editMode should set to 'selection'"), "success");
  var highlightSelection = cDoc.querySelector(".highlight-selection");
  var highlightOver = cDoc.getElementById("highlight-over");
  var target = tilepieces.core.currentDocument.querySelector("h1");
  target.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  await compare_highlight(target, highlightSelection, tilepieces);
  logOnDocument(assert(
    tilepieces.elementSelected == target,
    "tilepieces.elementSelected is correctly setted over the h1 element"), "success");
  ceTrigger.click();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logOnDocument(assert(
          tilepieces.contenteditable,
          "tilepieces.contenteditable is true"), "success");
        logOnDocument(`highlightSelection.style.transform -> ${highlightSelection.style.transform}`);
        logOnDocument(assert(
          highlightSelection.style.transform == 'translate(-9999px, -9999px)' &&
          target.hasAttribute("contenteditable"),
          "contenteditable activated by #contenteditable-trigger, and highlightSelection is hidden"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32)
  });
  target.innerHTML = "a <a href='#'><i>simple</i> <b>Test</b></a>";
  //target.dispatchEvent(new PointerEvent("input",{bubbles:true}));
  //target.dispatchEvent(new PointerEvent("blur",{bubbles:true}));
  var target2 = tilepieces.core.currentDocument.querySelector("mark");
  target2.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        /*
        logOnDocument(tilepieces.selectorObj.match.match.innerHTML);
        logOnDocument(target.innerHTML);
        logOnDocument(assert(
            tilepieces.selectorObj.match.match.innerHTML == target.innerHTML,
            "source doc updated on 'blur' event: tilepieces.selectorObj.match.match has been updated"), "success");
            */
        var newFind = tilepieces.core.htmlMatch.find(target);
        logOnDocument(assert(
          newFind && newFind.match && newFind.HTML,
          "target has been updated"), "success");
        logOnDocument(assert(
          highlightSelection.style.transform == 'translate(-9999px, -9999px)' &&
          target2.hasAttribute("contenteditable"),
          "contenteditable activated, and highlightSelection is hidden"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32)
  });
  ceTrigger.click();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        var newFind = tilepieces.core.htmlMatch.find(target2);
        logOnDocument(assert(
          newFind && newFind.match && newFind.HTML,
          "target has been updated"), "success");
        logOnDocument(assert(
          !target2.hasAttribute("contenteditable") &&
          !tilepieces.contenteditable,
          "target lost is 'contenteditable' attribute on 'click' event on #contenteditable-trigger ,tilepieces.contenteditable is falsy"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32)
  });
  selectionTrigger.click();
  logOnDocument(assert(
    tilepieces.editMode == "",
    "tilepieces.editMode should set to \"\" when clicking selectionTrigger"), "success");
}