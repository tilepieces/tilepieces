function keydown($self, e) {
  if ($self.options.firingOnlyAtTarget && e.target !== $self.target && !$self.target.contains(e.target))
    return;
  if ($self.options.preventDefault)
    e.preventDefault();
  if ($self.options.preventDefaultOnMeta &&
    (e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.metaKey)
  )
    e.preventDefault();
  $self.events.dispatch("down", e);
}