function multiselection($self, e) {
  console.log("multiselection", e);
  if (!$self.selected.length)
    return;
  var targetElement = e.target.nodeName != "LI" ? e.target.closest("li") : e.target;

  function cycle(t, siblingPath) {
    var original = t;
    var target = t;
    do {
      selection($self, {target, shiftKey: true});
      if (target === targetElement)
        return;
    } while (target = target[siblingPath]);
    //var parent = original.parentElement.closest("li[data-path]");
    //parent && parent[siblingPath] && cycle(parent,siblingPath);
  }

  if ($self.selected.length > 1) {
    for (var i = $self.selected.length - 2; i >= 0; i--)
      $self.selected[i].classList.remove("project-tree-selected")
    $self.selected.splice(0, $self.selected.length - 1);
  }
  var elToStart = $self.selected[0];
  if (offset(elToStart).top < offset(targetElement).top) // from top to bottom
    cycle(elToStart, "nextElementSibling");
  else
    cycle(elToStart, "previousElementSibling");
}