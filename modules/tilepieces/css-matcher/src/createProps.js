function createProps(cssMatches) {
  var properties = {};
  cssMatches.forEach(cssR => {
    for (var i = 0; i < cssR.rule.style.length; i++) {
      var propKey = cssR.rule.style[i];
      var value = cssR.rule.style.getPropertyValue(propKey);
      var priority = cssR.rule.style.getPropertyPriority(propKey);
      var shortHand = isShortHand(propKey);
      var alreadySetted = properties[propKey] ||
        (shortHand && properties[shortHand]);
      if (!alreadySetted ||
        (priority == "important" && !alreadySetted.priority))
        properties[propKey] = {value, priority, rule: cssR.rule, type: cssR.type};
    }
    /* THIS VERSION HAS A PROBLEM WITH SHORTHAND VALUES ( EX margin, or border-top )
    var props = cssR.properties;
    for(var i = 0;i<props.length;i++){
        var propKey = props[i].property;
        var value = cssR.rule.style.getPropertyValue(propKey);
        var priority = cssR.rule.style.getPropertyPriority(propKey);
        var alreadySetted;
        var alreadySetted = properties[propKey] || properties[propKey.split("-")[0]];
        if(!alreadySetted)
            properties[propKey]={value,priority};
        else if(priority == "important" && !alreadySetted.priority)
            alreadySetted.value = value;
    }
    */
  });
  return properties;
}