function registerPointDown(e, $self, cursor) {
  $self.x = e.x;
  $self.y = e.y;
  $self.preventIframeMousedown.style.display = "block";
  $self.preventMouseOut.style.cursor = cursor + "-resize";
}
