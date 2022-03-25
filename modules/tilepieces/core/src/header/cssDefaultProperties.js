tilepieces.cssDefaultProperties = [];
(() => {
  for (var k in document.body.style) {
    if (k == "cssFloat")
      continue;
    if (isNaN(k)) {
      var value = "";
      for (var i = 0; i < k.length; i++) {
        if (k.charAt(i) === k.charAt(i).toUpperCase())
          value += "-" + k.charAt(i).toLowerCase();
        else
          value += k.charAt(i)
      }
      tilepieces.cssDefaultProperties.push(value);
    }
  }
})();