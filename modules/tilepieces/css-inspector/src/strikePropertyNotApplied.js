function strikePropertyNotApplied(block) {
  var selectorRules = {};
  var blocks = block.querySelectorAll(".css-inspector__rule-block");
  for (var i = 0; i < blocks.length; i++) {
    var rule = blocks[i]["__css-viewer-rule"];
    var keys = blocks[i].querySelectorAll(".rule-block__key");
    for (var k = keys.length - 1; k >= 0; k--) {
      var parent = keys[k].parentNode;
      if(parent.classList.contains("is-not-inherited"))
        continue;
      if (!keys[k].previousElementSibling.checked) {
        parent.classList.add("css-inspector__rule-block__strike");
        continue;
      }
      var keyValue = keys[k].textContent.trim();
      var key = keyValue.replace(vendorPrefixesToDel, "");
      var value = keys[k].nextElementSibling.nextElementSibling &&
        keys[k].nextElementSibling.nextElementSibling.textContent.trim();
      if (!value)
        continue;
      var important = value && value.match(/!important/i);
      var shortHand = app.selectorObj.cssRules.isShortHand(key);
      var keyPresent = selectorRules[key] || (shortHand && selectorRules[shortHand]);
      if(keyPresent && keyPresent.value.match(/!important/i)) {
        parent.classList.add("css-inspector__rule-block__strike");
        continue;
      }
      var inherited = blocks[i].classList.contains("css-inspector__rule-block__inherited");
      var cssPropertyValue = rule.rule.style.getPropertyValue(key);
      var cssPropertyPriority = rule.rule.style.getPropertyPriority(key);
      //////////
      var isWrong = !cssPropertyValue ||
        (cssPropertyValue != value.replace(/!important/i, "").trim() &&
          !equalsCssValues(key, cssPropertyValue, value));
      var notExists = !keyPresent ||
        keyPresent.parent.closest(".css-inspector__rule-block") == blocks[i];
      /*
      var isImportantAndThereAreNotImportant =
          (keyPresent && important && !keyPresent.value.match(/!important/i) &&
          (!inherited || (keyPresent.inherited && !keyPresent.value.match(/!important/i))));*/
      var isActive = !isWrong && (notExists || cssPropertyPriority);
      if (keyPresent && isActive)
        keyPresent.parent.classList.add("css-inspector__rule-block__strike");
      if (isActive) {
        selectorRules[key] = {value, inherited, parent};
        parent.classList.remove("css-inspector__rule-block__strike");
      } else
        parent.classList.add("css-inspector__rule-block__strike");
    }
  }
}