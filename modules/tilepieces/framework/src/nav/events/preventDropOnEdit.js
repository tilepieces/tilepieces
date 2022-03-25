function preventDropOnEdit(e) {
  e.dataTransfer.effectAllowed = "none";
  e.dataTransfer.dropEffect = "none";
  e.preventDefault();
}