function setBoxShadowSVGtoXY() {
  var textShadowElsDOM = appView.querySelectorAll(".shadow");
  shadows = [...textShadowElsDOM].map(tse => {
    var svg = tse.querySelector("svg");
    var isAlreadyShadow = shadows.find(v => v.target == svg);
    var offsetX = model.boxShadows[tse.dataset.index].offsetX;
    var offsetY = model.boxShadows[tse.dataset.index].offsetY;
    if (!isAlreadyShadow) {
      var newSvgTextShadow = SVGtoXY(svg);
      // 100 = svg width / 2
      // 5 : arbitrary change value on axis
      var throttle = false;
      newSvgTextShadow.onChange((x, y) => {
        if (!throttle) {
          requestAnimationFrame(e => {
            var xAxis = Math.trunc((x - 100) / 5);
            var yAxis = Math.trunc((y - 100) / 5);
            model.boxShadows[svg.dataset.index].offsetX = xAxis;
            model.boxShadows[svg.dataset.index].offsetY = yAxis;
            model.boxShadow = setShadow();
            t.set("", model);
            inputCss(appView);
            throttle = false;
          });
          throttle = true;
        }
      });
      newSvgTextShadow.setXY((offsetX * 5) + 100, (offsetY * 5) + 100);
      return newSvgTextShadow;
    } else {
      isAlreadyShadow.setXY((offsetX * 5) + 100, (offsetY * 5) + 100);
      return isAlreadyShadow;
    }
  });
}