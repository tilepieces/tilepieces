let moveBar = document.getElementById("move-bar");
let moveBarX = 0, dockFrameWidth = 0, dockFrameHeight = 0, moveBarY = 0,
  mobileWrapperHeight = 0,
  mobileWrapperWidth = 0,
  moveBarActivated;
const movebardummy = document.querySelector(".move-bar-dummy");
moveBar.addEventListener("mousedown", e => {
  moveBarActivated = true;
  dockFrameWidth = dockFrame.offsetWidth;
  dockFrameHeight = dockFrame.offsetHeight;
  mobileWrapperHeight = mobileWrapper.offsetHeight;
  mobileWrapperWidth = mobileWrapper.offsetWidth;
  moveBarX = e.clientX;
  moveBarY = e.clientY;
  targetFrameWrapper.style.userSelect = "none";
  movebardummy.style.display = "block";
  document.addEventListener("mousemove", moveBarMove);
  document.addEventListener("mouseup", moveBarUp);
});
function moveBarMove(e) {
  if (mobileWrapper.className.match(/left|right/)) {
    if(mobileWrapper.classList.contains("right"))
      dockFrameWidth += (moveBarX - e.clientX);
    else
      dockFrameWidth -= (moveBarX - e.clientX);
    var targetFrameWrapperWidth = mobileWrapperWidth - dockFrameWidth - 4;
    if (targetFrameWrapperWidth < 400 || dockFrameWidth < 400)
      return;
    dockFrame.style.width = dockFrameWidth + "px";
    targetFrameWrapper.style.width = targetFrameWrapperWidth + "px";
    moveBarX = e.clientX;
  } else {
    if(mobileWrapper.classList.contains("bottom"))
      dockFrameHeight += (moveBarY - e.clientY);
    else
      dockFrameHeight -= (moveBarY - e.clientY);
    var targetFrameWrapperHeight = mobileWrapperHeight - dockFrameHeight - 4;
    if (targetFrameWrapperHeight < 250 || dockFrameHeight < 250)
      return;
    dockFrame.style.height = dockFrameHeight + "px";
    targetFrameWrapper.style.height = targetFrameWrapperHeight + "px";
    moveBarY = e.clientY;
  }
}
function moveBarUp(e) {
  moveBarActivated = false;
  movebardummy.style.display = "";
  targetFrameWrapper.style.userSelect = "";
  document.removeEventListener("mousemove", moveBarMove);
  document.removeEventListener("mouseup", moveBarUp);
}