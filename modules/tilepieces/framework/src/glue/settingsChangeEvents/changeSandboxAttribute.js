function changeSandboxAttribute(propValue) {
  if (propValue)
    tilepieces.frame.setAttribute("sandbox", "allow-same-origin");
  else
    tilepieces.frame.removeAttribute("sandbox");
  tilepieces.currentPage?.path && tilepieces.setFrame(tilepieces.currentPage.path);
}