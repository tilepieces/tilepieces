function isChildOfConditional(conditionalRules,rule){
    var isChildRule;
    for(var i = 0;i<conditionalRules.length;i++){
        var cond=conditionalRules[i];
        isChildRule = isChildOfConditionalRecursion(cond,
            rule.parentRule || rule.parentStyleSheet);
        if(isChildRule)
            break;
    }
    return isChildRule;
}
function isChildOfConditionalRecursion(cond,rule){
    if(cond.rule==rule)
        return cond;
    var r;
    for(var i = 0;i<cond.children.length;i++) {
        r = isChildOfMediaQueryRecursion(cond.children[i], rule);
        if(r)
            break;
    }
    return r;
}