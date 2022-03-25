function enableTooltipActions(setArray, inversed) {
  if (!setArray.length && !inversed)
    tooltipElHide = true;
  else {
    [...tooltipEl.children].forEach(child => {
      if (child.classList.contains("multiselection-tooltip"))
        return;
      if (!child.dataset.name) {
        var search = child.previousElementSibling;
        var enabled = false;
        while (search != tooltipEl.children[0] && search.tagName != "HR") {
          if (search.getAttribute("disabled") == null) {
            enabled = true;
            break;
          }
          search = search.previousElementSibling;
        }
        if (enabled)
          child.style.display = "block";
        else
          child.style.display = "none";
      } else if ((setArray.find(v => v == child.dataset.name) && inversed) ||
        (!setArray.find(v => v == child.dataset.name) && !inversed))
        child.setAttribute("disabled", "");
      else
        child.removeAttribute("disabled");
    });
    tooltipElHide = false;
  }
}