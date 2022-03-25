export function panelMenu(e, cWin, cDoc, tilepieces) {
  logOnDocument("Panel menu", "larger");
  var menuTrigger = cDoc.getElementById("menu-trigger");
  var menuBar = cDoc.getElementById("menu-bar");
  // on menu element click, we expect element menu bar to show
  menuTrigger.click();
  logOnDocument(assert(
    menuTrigger.classList.contains("opened") &&
    menuBar.style.display == "block",
    "#menu-bar element opened by clicking on #menu-trigger element"), "success");
  // we expect a list structured in a certain way
  var windowList = menuBar.querySelector("ul#window-list");
  var panels = windowList.querySelectorAll("li");
  logOnDocument(assert(
    panels.length == 2 &&
    panels[0].textContent == "CSS example" &&
    panels[1].textContent == "HTML example",
    "ul#window-list element is present inside menu bar, it has 2 list item correctly labeled as 'CSS example' and 'HTML example', the id attribute of the panel element we loaded in this test"), "success");
  // we expect to click on one of them and open a panel
  var cssExample = cDoc.getElementById("CSS example");
  panels[0].click();
  logOnDocument(assert(
    cssExample.style.display == "block",
    "#CSS example panel element should be visible"), "success");
  cssExample.querySelector(".panel-close").click();
  logOnDocument(assert(
    cssExample.style.display == "none",
    "#CSS example panel element closed"), "success");
}