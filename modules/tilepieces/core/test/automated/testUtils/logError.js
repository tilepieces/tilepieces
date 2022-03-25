function logError(e) {
  console.error(e);
  var errorToPrint = e.err || e.error || e.toString();
  logOnDocument(errorToPrint, "error");
  window.dispatchEvent(new CustomEvent("test-error", {
    detail: errorToPrint
  }))
}