// https://stackoverflow.com/questions/37624455/how-to-remove-wrapper-of-multiple-elements-without-jquery?noredirect=1&lq=1
function unwrap(elems) {
    elems = Array.isArray(elems) ? elems : [elems];
    var newElements = [];
    for (var i = 0; i < elems.length; i++) {
        var elem        = elems[i];
        var parent      = elem.parentNode;
        var grandparent = parent.parentNode;
        newElements.push(grandparent.insertBefore(elem, parent));
        if (!parent.firstChild)
            grandparent.removeChild(parent);
    }
    return newElements;
}