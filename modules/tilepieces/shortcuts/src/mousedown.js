function mousedown($self, e) {
  if ($self.options.firingOnlyAtTarget && e.target !== $self.target && !$self.target.contains(e.target))
    return;
  if ($self.options.preventDefault)
    e.preventDefault();
  if (e.ctrlKey)
    $self.events.dispatch("selection", e);
  if (e.shiftKey)
    $self.events.dispatch("multiselection", e);

  $self.events.dispatch("click", e);
}