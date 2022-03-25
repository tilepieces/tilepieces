function shortcuts(e) {
  var target = e.target;
  var dl = hint.querySelector("dl");
  var el = e.target;
  var selected;
  if (dl)
    selected = dl.querySelector(".selected");
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
      if (!dl)
        return;
      e.preventDefault();
      e.stopPropagation();
      var toUpdate;
      if (selected) {
        selected.classList.remove("selected");
        if (e.key == "ArrowUp") {
          if (selected.previousElementSibling)
            toUpdate = selected.previousElementSibling;
          else
            toUpdate = dl.children[dl.children.length - 1];
        } else {
          if (selected.nextElementSibling)
            toUpdate = selected.nextElementSibling;
          else
            toUpdate = dl.children[0];
        }
      } else {
        var first = dl.children[0];
        if (first && !first.classList.contains("no-suggestions"))
          toUpdate = first;
      }
      if (toUpdate) {
        toUpdate.classList.add("selected");
        globalFlagOnArrowMove = true;
        update(toUpdate);
      }
      break;
    case "ArrowRight":
    case "Enter":
    case "Tab":
      e.key == "Enter" && e.preventDefault();
      if (selected) {
        update(selected, e.key == "Enter" || e.key == "ArrowRight");
      }
      hint.style.display = "none";
      hint.innerHTML = "";
    default:
      break;
  }
}