function onRenameKeydown(e) {
  if (e.key == "Enter") {
    e.preventDefault();
    e.target.dispatchEvent(new Event("blur"));
  }
}