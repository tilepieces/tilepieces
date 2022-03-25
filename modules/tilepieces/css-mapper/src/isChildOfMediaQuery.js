function isChildOfMediaQuery(mediaQueries,rule){
    var isChildRule;
    for(var i = 0;i<mediaQueries.length;i++){
        var mQ=mediaQueries[i];
        isChildRule = isChildOfMediaQueryRecursion(mQ,
            rule.parentRule || rule.parentStyleSheet);
        if(isChildRule)
            break;
    }
    return isChildRule;
}
function isChildOfMediaQueryRecursion(mediaQuery,rule){
    if(mediaQuery.rule==rule)
        return mediaQuery;
    var r;
    for(var i = 0;i<mediaQuery.children.length;i++) {
        r = isChildOfMediaQueryRecursion(mediaQuery.children[i], rule);
        if(r)
            break;
    }
    return r;
}
