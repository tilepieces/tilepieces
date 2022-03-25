import {compare_highlight} from './compare_highlight.js';

export async function selectElement(e, cWin, cDoc, tilepieces) {
  logOnDocument("Select element", "larger");
  var selectionTrigger = cDoc.getElementById("selection-trigger");
  var highlightSelection = cDoc.querySelector(".highlight-selection");
  var highlightOver = cDoc.getElementById("highlight-over");
  logOnDocument(assert(
    tilepieces.editElements.selection == highlightSelection &&
    tilepieces.editElements.highlight == highlightOver,
    "the 'highlight' is obtained by two elements, #highlight-over and .highlight-selection ( this one could be cloned for" +
    "multi selection , however the last one should be it ). They are referenced in tilepieces.editElements.selection and " +
    "tilepieces.editElements.highlight )"), "success");
  logOnDocument(assert(
    tilepieces.editMode == "",
    "selection, when triggered, set tilepieces.editMode. The default is ''"), "success");
  selectionTrigger.click();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logOnDocument(assert(
          tilepieces.editMode == "selection",
          "tilepieces.editMode should set to 'selection'"), "success");
        logOnDocument("compare highlight selection on click");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32);
  });
  var target = tilepieces.core.currentDocument.querySelector("h1");
  target.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  await compare_highlight(target, highlightSelection, tilepieces);
  logOnDocument(assert(
    tilepieces.elementSelected == target,
    "tilepieces.elementSelected is correctly setted over the h1 element"), "success");
  logOnDocument("compare highlight over on mousemove");
  var target2 = tilepieces.core.currentDocument.querySelector("mark");
  target2.dispatchEvent(new PointerEvent("mousemove", {bubbles: true}));
  await compare_highlight(target2, highlightOver, tilepieces);
  logOnDocument(assert(
    tilepieces.elementSelected == target,
    "tilepieces.elementSelected is correctly setted over the h1 element, again"), "success");
  logOnDocument("compare highlight over on document mouseout");
  tilepieces.core.currentDocument.dispatchEvent(new PointerEvent("mouseout"));
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logOnDocument("highlightOver.style.transform -> ");
        logOnDocument(highlightOver.style.transform);
        logOnDocument(assert(
          highlightOver.style.transform == 'translate(-9999px, -9999px)',
          "highlightOver on document mouse out has transform == 'translate(-9999px, -9999px)'"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32)
  });
  highlightSelection.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logOnDocument(`highlightSelection.style.transform -> ${highlightSelection.style.transform}`);
        logOnDocument(assert(
          highlightSelection.style.transform == 'translate(-9999px, -9999px)' &&
          !tilepieces.elementSelected,
          "highlightSelection after pointerdown on itself has transform == 'translate(-9999px, -9999px)' and " +
          "tilepieces.elementSelected is falsy"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32)
  });
  selectionTrigger.click();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        logOnDocument(assert(
          tilepieces.editMode == "",
          "tilepieces.editMode should set to \"\" when clicking selectionTrigger"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32);
  });
}