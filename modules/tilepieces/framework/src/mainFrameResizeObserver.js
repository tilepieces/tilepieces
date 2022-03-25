let throttleResize;
let resizeObserver = new ResizeObserver(entries => {
  clearTimeout(throttleResize);
  throttleResize = setTimeout(() => {
    tilepieces.frameContentRect = entries[0].contentRect;
    window.dispatchEvent(new CustomEvent("frame-resize", {detail: entries[0].contentRect}));
  }, 32);
});
resizeObserver.observe(tilepieces.frame);