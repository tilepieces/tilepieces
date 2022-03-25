function getChildTree(father,child){
    var swap = child;
    var tree = [];
    while(swap!=father){
        var childIndex = [...swap.parentNode.childNodes].indexOf(swap);
        tree.unshift(childIndex);
        swap = swap.parentNode;
    }
    return tree;
}
