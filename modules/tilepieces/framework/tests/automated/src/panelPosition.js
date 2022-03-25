export function panelPosition(e, cWin, cDoc, tilepieces) {
  logOnDocument("Panel position", "larger");
  logOnDocument("This test is related to the positions of frame element and panels position.", "large");
  logOnDocument("We test just the correctness of the js logic. A human should look the rendered", "large");
  logOnDocument("The logic is:");
  logOnDocument("The user experience change with screen resolution, and the threshold is 1024px: " +
    "minor of this point, we can called it 'mobile' ( and the rest 'desktop')");
  logOnDocument("When on mobile, only this 'panelPosition' values could be setted: right (or left) when " +
    "the screen is on 'landscape' resolution, bottom (or top) on 'portrait'");
  var width = cWin.innerWidth;
  if (width >= 1024) {
    document.getElementById("test-frame").style.width = "475px";
    document.getElementById("test-frame").style.height = "984px";
    cWin.dispatchEvent(new Event("resize"))
  }
  var wrapperFrame = cDoc.getElementById("target-frame-wrapper");
  logOnDocument(!wrapperFrame.classList.contains("half"), "#target-frame-wrapper ( frame's wrapper ) do not contain " +
    "'half' class, so, in our logic, it not should be visible and the frame will occupy the all the window space left by the menu", "success");
  // we expect a list structured in a certain way
  var menuBar = cDoc.getElementById("menu-bar");
  var windowList = menuBar.querySelector("ul#window-list");
  var panels = windowList.querySelectorAll("li");
  // we expect to click on one of them and open a panel
  var cssExample = cDoc.getElementById("CSS example");
  panels[0].click();
  logOnDocument(assert(
    cssExample.style.display == "block",
    "#CSS example panel element should be visible"), "success");
  logOnDocument(assert(wrapperFrame.classList.contains("half"), "now, they should be divided in two ( is portrait, so as columns )"), "success");
  logOnDocument("tester should look if panels are: visible, in scrollable , when there is only one, the width of the parent could be resized")
  document.getElementById("test-frame").style.width = "1024px";
  cWin.dispatchEvent(new Event("resize"))
  logOnDocument(assert(!wrapperFrame.classList.contains("half"),
    "we have moved to 'desktop' interface, wrapperFrame would be without 'half' class ( that do nothing, because the .half part is on an media query )"), "success");
  logOnDocument("panelPosition are this : 'free' ( the panels are not docked, free to move anywhere on the page ), and " +
    "'top','left','right','bottom'. The latests dock the panel according to the position, panels are visible and scrollable when they not fit the space");
  logOnDocument("tester should check this");
  var mobileWrapper = cDoc.getElementById("mobile-wrapper");
  var panel =
    tilepieces.changeSettingsInPage("panelPosition", "right");
  logOnDocument(assert(mobileWrapper.classList.contains("right"),
    " tilepieces.changeSettingsInPage(\"panelPosition\",\"right\") sets a class 'right' on #mobile-wrapper "), "success");
  var panel =
    tilepieces.changeSettingsInPage("panelPosition", "left");
  logOnDocument(assert(mobileWrapper.className == "left",
    " tilepieces.changeSettingsInPage(\"panelPosition\",\"left\") sets a #mobile-wrapper className on 'left'"), "success");
  var panel =
    tilepieces.changeSettingsInPage("panelPosition", "top");
  logOnDocument(assert(mobileWrapper.className == "top",
    " tilepieces.changeSettingsInPage(\"panelPosition\",\"top\") sets a #mobile-wrapper className on 'top'"), "success");
  var panel =
    tilepieces.changeSettingsInPage("panelPosition", "bottom");
  logOnDocument(assert(mobileWrapper.className == "bottom",
    " tilepieces.changeSettingsInPage(\"panelPosition\",\"bottom\") sets a #mobile-wrapper className on 'bottom'"), "success");
  document.getElementById("test-frame").style.width = "";
  document.getElementById("test-frame").style.height = "";
  cWin.dispatchEvent(new Event("resize"))
}