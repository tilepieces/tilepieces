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
    evs.dispatch("confirm", false);
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
      window.dispatchEvent(new Event("lock-down"))
      return {
        dialog: dialogContent,
        events: evs
      };
    },
    close: () => {
      if(!w.dialog.dialogElement.classList.contains("open"))
        return;
      window.dispatchEvent(new Event("release"));
      dialog.classList.remove("lock-down");
      dialog.classList.remove("open", "on-top");
      document.body.style.overflow = "";
      evs.dispatch("close", dialog);
    },
    dialogElement: dialog
  };
})(window);
(() => {
  const promptDialogEl = document.getElementById("tilepieces-prompt-dialog");
  const promptDialogLabel = document.getElementById("tilepieces-prompt-dialog-label");
  const promptDialogForm = document.getElementById("tilepieces-dialog-prompt-form");
  const promptDialogButton = document.getElementById("tilepieces-prompt-dialog-button");
  const promptDialogInput = promptDialogForm.querySelector("input");
  const promptCloseButton = promptDialogEl.children[1];
  const errorLabel = document.getElementById("tilepieces-prompt-dialog-label-error");
  let patternFunction;
  let checkOnSubmit;
  let evs;

  function close() {
    promptDialogEl.classList.remove("open");
    document.body.style.overflow = "";
  }

  promptCloseButton.addEventListener("click", () => {
    window.dispatchEvent(
      new Event('prompt-dialog-reject')
    );
    evs.dispatch("reject", false);
    close()
  });
  promptDialogEl.addEventListener("keydown", e => {
    if (e.key == "Escape")
      promptCloseButton.click();
    if (e.key == "Enter")
      submit(e)
  }, true);

  function checking(target) {
    if (!target.value || (target.dataset.pattern && target.value.match(new RegExp(target.dataset.pattern))) ||
      (patternFunction && !patternFunction(target.value, target))
    ) {
      target.setAttribute("data-invalid", "");
    } else {
      target.removeAttribute("data-invalid");
    }
  }

  function checkValidity(e) {
    if (checkOnSubmit) {
      e.target.removeAttribute("data-invalid");
      return;
    }
    if (!e.target.dataset.pattern && !patternFunction)
      return;
    checking(e.target)
  }

  function submit(e) {
    e.preventDefault();
    var target = promptDialogForm[0];
    if (checkOnSubmit)
      checking(target);
    if (target.hasAttribute("data-invalid")) {
      return;
    }
    var value = target.value.trim();
    //if(target.value)
    window.dispatchEvent(
      new CustomEvent('prompt-dialog-submit', {detail: {value}})
    );
    evs.dispatch("submit", value);
    close()
  }

  promptDialogInput.addEventListener("input", checkValidity);
  promptDialogForm.addEventListener("submit", submit);
  window.promptDialog = function (options = {
    label: "",
    buttonName: "",
    pattern: "",
    patternFunction: false,
    patternExpl: "",
    checkOnSubmit: false,
    onTop: false
  }) {
    promptDialogInput.value = "";
    if (options.label)
      promptDialogLabel.textContent = options.label;
    if (options.buttonName)
      promptDialogButton.textContent = options.buttonName;
    if (options.pattern) {
      promptDialogInput.dataset.pattern = options.pattern;
    }
    patternFunction = options.patternFunction || null;
    checkOnSubmit = options.checkOnSubmit;
    errorLabel.innerHTML = options.patternExpl || "invalid";
    document.body.style.overflow = "hidden";
    promptDialogEl.classList.add("open");
    if (options.onTop)
      promptDialogEl.classList.add("on-top");
    else
      promptDialogEl.classList.remove("on-top");
    promptDialogInput.focus();
    evs = events();
    return {
      events: evs
    };
  }
})();
