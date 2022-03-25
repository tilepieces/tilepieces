function getChildFromTree(father,tree){
    var res = father;
    for(var i = 0;i<tree.length;i++) {
        var el = res.childNodes[tree[i]];
        if (el)
            res = el;
        else
            return res;
    }
    return res;
}