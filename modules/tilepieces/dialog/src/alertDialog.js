(() => {
  const alertDialogEl = document.getElementById("tilepieces-alert-dialog");
  const alertDialogLabel = document.getElementById("tilepieces-alert-dialog-label");
  const alertCloseButton = alertDialogEl.children[1];
  const alertDialogForm = document.getElementById("tilepieces-dialog-alert-form");
  alertCloseButton.addEventListener("click", () => {
    alertDialogEl.classList.remove("open");
    window.dispatchEvent(
      new Event('alert-dialog-reject')
    );
  });
  alertDialogEl.addEventListener("keydown", e => {
    if (e.key == "Escape" || e.key == "Enter")
      submit(e)
  });

  function submit(e) {
    e.preventDefault();
    alertDialogForm.removeEventListener("submit", submit);
    alertDialogEl.classList.remove("open");
    window.dispatchEvent(
      new Event('alert-dialog-submit')
    );
  }

  window.alertDialog = function (docFragment, error) {
    if (typeof docFragment === 'string')
      alertDialogLabel.innerHTML = docFragment;
    else
      alertDialogLabel.appendChild(docFragment);
    if (error)
      alertDialogEl.classList.add("error");
    else
      alertDialogEl.classList.remove("error");
    alertDialogForm.addEventListener("submit", submit);
    alertDialogEl.classList.add("open");
  }
})();