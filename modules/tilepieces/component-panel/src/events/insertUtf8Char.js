utf8CharsSection.addEventListener("click", e => {
  if (e.target.tagName != "BUTTON")
    return;
  var empyChar = e.target.dataset.emptyCharDec;
  var string = empyChar ? String.fromCharCode(empyChar) : e.target.textContent;
  opener.wysiwyg.insertString(string);
  app.lastEditable.el.dispatchEvent(new Event('input'));
  app.lastEditable.el.focus();
});