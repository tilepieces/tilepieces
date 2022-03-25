function disconnectFrame(errorObject, errorStringForAlert = ""){
  console.error(errorObject);
  menuBarTrigger.classList.add("no-frame");
  tilepieces.core?.destroy();
  document.title = `${tilepieces.project ? `${tilepieces.project.name} - ` : ``}`;
  if(tilepieces.project) {
    history.pushState({
      project: tilepieces.project
    }, "", "?project=" + encodeURIComponent(tilepieces.project.name));
  }
  errorStringForAlert && alertDialog(errorStringForAlert, true);
}