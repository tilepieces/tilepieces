refreshTrigger.addEventListener("click", e => {
  e.preventDefault();
  tilepieces.core.currentWindow.location.reload();
  //tilepieces.setFrame(tilepieces.currentPage.path);
});