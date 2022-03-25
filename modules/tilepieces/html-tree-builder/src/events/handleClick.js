function handleClick(e, $self) {
  if (e.target.classList.contains("html-tree-builder__caret"))
    return;
  if (e.target.closest(".menu-toggle-wrapper"))
    return;
  /* get target */
  var target = e.target.closest(".html-tree-builder-el");
  if ($self.preventDefaultClickOnMs && $self.preventDefaultClickOnMs(e, target))
    return;
  var multiselection = $self.multiselection;
  var multiselected = $self.multiselected;
  if (multiselection) {
    var multiSelectionIndex = $self.multiselected.findIndex(v => v.listEl == target);
    if (multiSelectionIndex > -1) {
      var el = $self.multiselected[multiSelectionIndex].el;
      $self.removeItemSelected(multiSelectionIndex);
      opener.dispatchEvent(
        new CustomEvent("html-tree-remove-multiselection", {
          detail: {
            el,
            index: multiSelectionIndex,
            target
          }
        })
      );
      return;
    }
  }
  if ($self.selected == target)
    return;
  if (multiselection &&
    multiselected.find(v => v.listEl.contains(target) || target.contains(v.listEl))) {
    console.warn("clicked inside an element already selected. quit");
    return;
  }
  // normal handling select el
  $self.toggleClassListHighlight(target);
  opener.dispatchEvent(
    new CustomEvent('html-tree-builder-click', {
      detail: {
        selected: target,
        target: target["__html-tree-builder-el"],
        e,
        multiselection
      }
    })
  );
}