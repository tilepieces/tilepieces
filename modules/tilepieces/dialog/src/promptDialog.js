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