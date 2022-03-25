export function compare_highlight(target, element, tilepieces) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        var bound = target.getBoundingClientRect();
        var x = parseInt(tilepieces.frame.offsetLeft + bound.x);
        var y = parseInt(tilepieces.frame.offsetTop + bound.y);
        var width = parseInt(bound.width);
        var height = parseInt(bound.height);
        var regNu = new RegExp(tilepieces.utils.numberRegex, "g");
        logOnDocument(`${element.style.width.replace(regNu, match => Math.trunc(match))} == ${width}px`);
        logOnDocument(`${element.style.height.replace(regNu, match => Math.trunc(match))} == ${height}px`);
        logOnDocument(`${element.style.transform.replace(regNu, match => Math.trunc(match))} == translate(${x}px,${y}px)`);
        logOnDocument(assert(
          element.style.width.replace(regNu, match => Math.trunc(match)) == width + "px" &&
          element.style.height.replace(regNu, match => Math.trunc(match)) == height + "px" &&
          element.style.transform.replace(regNu, match => Math.trunc(match)) == "translate(" + x + "px, " + y + "px)",
          "element is correctly translated ( according to tilepieces-core/src/selection/translateHighlight.js )"), "success");
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 32)
  })
}