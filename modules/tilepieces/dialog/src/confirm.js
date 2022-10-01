(() => {
  const confirmDialogEl = document.getElementById("tilepieces-confirm-dialog");
  const confirmDialogLabel = document.getElementById("tilepieces-confirm-dialog-label");
  const confirmButton = document.getElementById("tilepieces-confirm-dialog-button");
  const rejectButton = document.getElementById("tilepieces-reject-dialog-button");
  const confirmCloseButton = confirmDialogEl.children[1];
  let evs;
  confirmCloseButton.addEventListener("click", reject);
  rejectButton.addEventListener("click", reject);
  confirmButton.addEventListener("click", confirm);

  confirmDialogEl.addEventListener("keydown", e => {
    if (e.key == "Escape")
      rejectButton.click();
  }, true);

  function reject() {
    window.dispatchEvent(
      new Event('confirm-dialog-reject')
    );
    confirmDialogEl.classList.remove("open");
    evs.dispatch("reject", true);
  }

  function confirm(e) {
    e.preventDefault();
    window.dispatchEvent(
      new Event('confirm-dialog-submit')
    );
    confirmDialogEl.classList.remove("open");
    evs.dispatch("confirm", true);
  }

  window.confirmDialog = function (label) {
    confirmDialogLabel.innerText = label;
    confirmDialogEl.classList.add("open");
    evs = events();
    return {
      events: evs
    };
  };
})();