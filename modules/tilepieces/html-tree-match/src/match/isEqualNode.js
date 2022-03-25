function isEqualNode(el,equalNode,isLast,relax=true){
    //*
    var cloneChildrenArray = isLast ? [...el.childNodes] :[...el.children];
    var find = cloneChildrenArray.filter(child=>{
        if(!isLast || relax)
            return child.cloneNode().isEqualNode(equalNode.cloneNode());
        //return child.nodeName == equalNode.nodeName;
        else {
            // innerText is not always valorized ( see drag/automatic_test )
            // textContent has some problem with spaces...
            var childText = child.textContent;
            var equalNodeText = equalNode.textContent;
            var isEqual = equalNode.nodeType == 3 ?
            childText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") ==
            equalNodeText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") :
            child.outerHTML == equalNode.outerHTML;
            return isEqual;
        }
    });
    if(find.length > 1){
        var originalChilds = isLast ? [...equalNode.parentNode.childNodes] : [...equalNode.parentNode.children];
        var originals = originalChilds.filter(child=>{
            if(!isLast || relax)
                return child.cloneNode().isEqualNode(equalNode.cloneNode());
            else {
                var childText = child.textContent;
                var equalNodeText = equalNode.textContent;
                var isEqual = equalNode.nodeType == 3 ?
                childText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") ==
                equalNodeText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") :
                child.outerHTML == equalNode.outerHTML;
                return isEqual;
            }
        });
        if(originals.length !== find.length && !relax) // comparing the two trees, there is a difference in length for the current searched noded. return false
            return false;
        var originalPosition = originals.indexOf(equalNode);
        return find[originalPosition];
    }
    return find[0];

}