function modifyValueProperty(rule,prop,value,isStyle){
    var priority = "";
    var matchImportant = value.match(/!important/i);
    if(matchImportant) {
        value = value.substring(0,matchImportant.index) +
            value.substring(matchImportant.index+matchImportant[0].length);
        priority = "important";
    }
    if(isStyle)
        opener.tilepieces.core.htmlMatch.style(rule.rule,prop,value,priority);
    else
        opener.tilepieces.core.setCssProperty(rule.rule,prop,value,priority);
};
