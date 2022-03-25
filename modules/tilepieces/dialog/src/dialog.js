((w) => {
  var dialog = document.getElementById("tilepieces-dialog");
  let evs;
  var dialogContent = dialog.children[0]; // .tilepieces-dialog-content
  var closeButton = dialog.children[1]; // .tilepieces-dialog-close
  closeButton.addEventListener("click", () => {
    window.dispatchEvent(new Event("release"));
    dialog.classList.remove("lock-down");
    dialog.classList.remove("open", "on-top");
    document.body.style.overflow = "";
    evs.dispatch("close", dialog);
  });
  dialog.addEventListener("keydown", e => {
    if (e.key == "Escape" && closeButton.style.display == "block") {
      window.dispatchEvent(new Event("release"));
      dialog.classList.remove("open", "on-top");
      document.body.style.overflow = "";
      evs.dispatch("close", dialog);
    }
  }, true);
  w.dialog = {
    closeDisabled: false,
    open: (docFragment, closeDisabled, onTop) => {
      document.body.style.overflow = "hidden";
      if (docFragment) {
        dialogContent.innerHTML = "";
        if (typeof docFragment === 'string')
          dialogContent.innerHTML = docFragment;
        else
          try {
            dialogContent.appendChild(docFragment);
          } catch (e) {
            console.error(e, docFragment);
            dialogContent.innerHTML = "an error has occurred";
          }
      }
      dialog.classList.add("lock-down");
      window.dispatchEvent(new Event("lock-down"))
      if (closeDisabled) {
        closeButton.style.display = "none";
      } else {
        closeButton.style.display = "block";
      }
      dialog.classList.add("open");
      /* first input focus. here because it's common */
      var inputToFocus = dialogContent.querySelector("input:not([type=hidden])");
      inputToFocus && inputToFocus.focus();
      evs = events();
      if (onTop) {
        dialog.classList.add("on-top");
      } else
        dialog.classList.remove("on-top");
      return {
        dialog: dialogContent,
        events: evs
      };
    },
    close: () => {
      window.dispatchEvent(new Event("release"));
      dialog.classList.remove("lock-down");
      dialog.classList.remove("open", "on-top");
      document.body.style.overflow = "";
      evs.dispatch("close", dialog);
    },
    dialogElement: dialog
  };
})(window);