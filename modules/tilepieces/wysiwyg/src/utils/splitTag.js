function splitTag(el,range,p,removePivot){
    var pivot = p || range.commonAncestorContainer;
    if(!el.contains(pivot) && el != pivot){
        console.error("el,parentPivot ->",el,"\n",pivot);
        throw new Error("Error in split tag. Split tag called with !el.contains(parentPivot);")
    }
    var firstAncestor = el.nodeType != 3 ? el.cloneNode() : el.ownerDocument.createDocumentFragment();
    if(pivot.nodeType == 3 && pivot == range.commonAncestorContainer && range.collapsed) {
        if(range.startOffset == 0)
            return firstAncestor;
        else
            pivot = pivot.splitText(range.startOffset);
        /*
         else if(range.startOffset == pivot.textContent.length) {
         var newPivot = pivot.ownerDocument.createTextNode("");
         pivot.parentNode.appendChild(newPivot,pivot);
         pivot = newPivot;
         }
         */
    }
    if(el.nodeType != 3)
        firstAncestor.removeAttribute("id");
    if(pivot != el) {
        var split1 = pivot;
        while (split1 != el) {
            var newAncestor = split1.cloneNode();
            split1.id && split1.removeAttribute("id");
            if(firstAncestor.childNodes.length) {
                while(firstAncestor.firstChild)
                    newAncestor.appendChild(firstAncestor.firstChild);
                firstAncestor.appendChild(newAncestor);
            }
            else if(!removePivot)
                firstAncestor.appendChild(newAncestor);

            while(split1.previousSibling)
                firstAncestor.insertBefore(split1.previousSibling,firstAncestor.firstChild);
            split1 = split1.parentNode;
        }
    }
    return firstAncestor;
}