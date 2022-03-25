window.tilepieces_tabs = function (options) {
  var outside = options.el;
  var inside = outside.querySelector(".tab-buttons-inside");
  var tabPrev = outside.querySelector(".tab-prev");
  var tabNext = outside.querySelector(".tab-next");
  var tabSelected = inside.querySelector(".selected");
  var tabSelectedElement = !options.noAction && tabSelected && outside.ownerDocument.querySelector(tabSelected.getAttribute("href"));
  var maximumRight;
  var left = 0;
  var throttle;

  function callbackObserver() {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      if (!inside.lastElementChild)
        return;
      maximumRight = -Math.abs((inside.lastElementChild.offsetLeft + inside.lastElementChild.offsetWidth) - inside.offsetWidth);
      var swapleft = left;
      tabSelected && moveTabSelected(tabSelected);
      if(left != swapleft)
        inside.style.transform = "translateX(" + left + "px)";
      displayArrows();
    }, 32);
  }

  var resizeObserver = new ResizeObserver(callbackObserver);
  resizeObserver.observe(outside);
  var observer = new MutationObserver(callbackObserver);
  observer.observe(inside, {childList: true, subtree: true});
  tabPrev.addEventListener("click", function (e) {
    left += inside.offsetWidth / 2;
    if (left > 0)
      left = 0;
    inside.style.transform = "translateX(" + left + "px)";
    displayArrows();
  });
  tabNext.addEventListener("click", function (e) {
    left -= inside.offsetWidth / 2;
    if (left < maximumRight)
      left = maximumRight;
    inside.style.transform = "translateX(" + left + "px)";
    displayArrows();
  });

  function moveTabSelected(tabSelected){
    var tabSelectedLeft = tabSelected.offsetLeft;
    var tabSelectedWidth = tabSelected.offsetWidth;
    var sum = -(tabSelectedLeft + tabSelectedWidth);
    var tabPrevOffsetWidth = (tabPrev.offsetWidth || 37);
    var tabNextOffsetWidth = (tabNext.offsetWidth || 37);
    if(-tabSelectedLeft > (left-tabPrevOffsetWidth) ||
      sum<left - inside.offsetWidth + tabNextOffsetWidth){
      var delta = -tabSelectedLeft + tabPrevOffsetWidth;
      left = delta > 0 ? 0 : delta < maximumRight ? maximumRight : delta;
    }
  }

  function displayArrows(e) {
    if (inside.scrollWidth <= inside.offsetWidth) {
      if(left){
        left = 0;
        inside.style.transform = "translateX(0px)";
      }
      tabPrev.style.display = "none";
      tabNext.style.display = "none";
      return;
    }
    if (left == 0)
      tabPrev.style.display = "none";
    else
      tabPrev.style.display = "block";
    if (left < maximumRight) {
      left = maximumRight;
      inside.style.transform = "translateX(" + left + "px)";
    }
    if (left == maximumRight)
      tabNext.style.display = "none";
    else
      tabNext.style.display = "block";
  }

  inside.addEventListener("click", e => {
    var target = e.target.closest("a");
    if (!target)
      return;
    e.preventDefault();
    if (target != tabSelected) {
      options.onSelect && options.onSelect(e, target);
      if (options.noAction)
        return;
      if (tabSelected) {
        tabSelected.classList.remove("selected");
        //tabSelectedElement.style.display = "none";
        tabSelectedElement.hidden = true;
        if (tabSelectedElement.style.display)
          tabSelectedElement.style.display = "";
      }
      tabSelected = target;
      tabSelectedElement = target.ownerDocument.querySelector(tabSelected.getAttribute("href"));
      tabSelectedElement.hidden = false;
      if (tabSelectedElement.style.display)
        tabSelectedElement.style.display = options.display || "block";
      tabSelected.classList.add("selected");
      var swapleft = left;
      moveTabSelected(tabSelected);
      if(left != swapleft) {
        inside.style.transform = "translateX(" + left + "px)";
        displayArrows();
      }
    }
  });
};