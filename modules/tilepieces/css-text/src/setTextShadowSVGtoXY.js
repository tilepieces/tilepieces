function setTextShadowSVGtoXY() {
  var textShadowElsDOM = appView.querySelectorAll(".text-shadow");
  textShadowElsDOM.forEach(tse => {
    var svg = tse.querySelector("svg");
    var textShadow = svg.closest(".text-shadow");
    var isAlreadyShadow = textShadowEls.find(v => v.target == svg);
    var offsetXInput = textShadow.querySelector("[data-text-shadow=offsetX]");
    var offsetYInput = textShadow.querySelector("[data-text-shadow=offsetY]");
    if (!isAlreadyShadow) {
      var newSvgTextShadow = SVGtoXY(svg);
      // 100 = svg width / 2
      // 5 : arbitrary change value on axis
      var throttle;
      newSvgTextShadow.onChange((x, y) => {
        clearTimeout(throttle);
        throttle = setTimeout(() => {
          var xAxis = Math.trunc((x - 100) / 5);
          var yAxis = Math.trunc((y - 100) / 5);
          //offsetXInput.value = xAxis;
          //offsetYInput.value = yAxis;
          model.textShadows[svg.dataset.index].offsetX = xAxis;
          model.textShadows[svg.dataset.index].offsetY = yAxis;
          model.textShadow = setTextShadow(model.textShadows);
          t.set("", model);
          inputCss(appView);
        })
      });
      newSvgTextShadow.setXY((offsetXInput.value * 5) + 100, (offsetYInput.value * 5) + 100);
      textShadowEls.push(newSvgTextShadow);
    } else {
      isAlreadyShadow.setXY((offsetXInput.value * 5) + 100, (offsetYInput.value * 5) + 100);
    }
  })
}