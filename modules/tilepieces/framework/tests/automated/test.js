import {preparation} from './src/preparation.js';
import {panelMenu} from './src/panelMenu.js';
import {panelPosition} from './src/panelPosition.js';
import {selectElement} from './src/select_element.js';
import {editElement} from './src/editElement.js';
import {screenDimensions} from './src/screenDimensions.js';

let tilepiecesRef;
setTestFramework(document.getElementById("test-frame"), "examples/index.html")
  .then(async ({e, cWin, cDoc, tilepieces}) => {
    tilepiecesRef = tilepieces;
    logOnDocument("it's crucial in this test to leave your mouse out of the page. Keep it in the url bar should work", "large");
    try {
      await preparation(e, cWin, cDoc, tilepieces);
    } catch (e) {
      logError(e);
    }
    try {
      await panelMenu(e, cWin, cDoc, tilepieces);
    } catch (e) {
      logError(e);
    }
    try {
      await selectElement(e, cWin, cDoc, tilepieces);
    } catch (e) {
      logError(e);
    }
    try {
      await editElement(e, cWin, cDoc, tilepieces);
    } catch (e) {
      logError(e);
    }
    try {
      await screenDimensions(e, cWin, cDoc, tilepieces);
    } catch (e) {
      logError(e);
    }
  }, logError);
//var logSection = document.getElementById("log-section");
// logSection has been declared in test utils
const trButton = document.getElementById("test-results");
const showOrHide = (soh) => soh ? "Hide" : "Show";
trButton.addEventListener("click", e => {
  var show = logSection.classList.toggle("show");
  trButton.textContent = showOrHide(show) + " test results";
});
document.getElementById("change-panel-position").addEventListener("change", e => {
  var panel =
    tilepiecesRef.changeSettingsInPage("panelPosition", e.target.value)
});