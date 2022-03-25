HTMLTreeMatch.prototype.match = function(el,takeLastMatch = true,relax = false,inverse = false){
    var $self = this;
    var source=inverse ? $self.contentDocument : $self.source;
    var startLevel = source.body;
    var startLevelToCompare= inverse ? $self.source.body : el.getRootNode().body;
    ////
    if(el.tagName == "HTML")
        if(el.cloneNode().isEqualNode(source.documentElement.cloneNode())) {
            !$self.matches.find(v=>v.DOMel == el) &&
            $self.matches.push({
                match : source.documentElement,
                DOMel : el
            });
            return source.documentElement;
        }
        else
            return false;
    if(el.tagName == "HEAD")
        if(el.cloneNode().isEqualNode(source.head.cloneNode())) {
            !$self.matches.find(v=>v.DOMel == el) &&
            $self.matches.push({
                match : source.head,
                DOMel : el
            });
            return source.head;
        }
        else
            return false;
    if(el.ownerDocument.head.contains(el)){
        /*
        var matchHead = $self.matchHead(el);
        matchHead && !$self.matches.find(v=>v.DOMel == el) &&
        $self.matches.push({
            match : matchHead,
            DOMel : el
        });
        return matchHead*/
        startLevel = source.head;
        startLevelToCompare = el.ownerDocument.head;
    }
    if(el.tagName == "BODY")
        if(el.cloneNode().isEqualNode(source.body.cloneNode())){
            !$self.matches.find(v=>v.DOMel == el) &&
            $self.matches.push({
                match : source.body,
                DOMel : el
            });
            return source.body;
        }
        else
            return false;
    var elementToChange = null;
    var levels = getLevels(el,startLevelToCompare);
    for(var search = levels.length-1;search>=0;search--){
        var elInner = levels[search];
        if(elInner.id) {
            try {
                var searchDoubleId = source.querySelectorAll("#" + elInner.id);
            }catch(e){break}
            if(searchDoubleId.length > 1)
                break;
            startLevel = source.getElementById(elInner.id);
            if(!startLevel)
                return;
            //
            if(search == levels.length-1) {
                //if(startLevel.isEqualNode(elInner)) {
                    $self.matches.push({
                        match : startLevel,
                        DOMel : el
                    });
                    return startLevel;
                /*
                }
                else
                    return false;*/
            }
            else
                levels = levels.slice(search+1, levels.length);
            break;
        }
    }
    for(var i = 0;i<levels.length;i++){
        var elToCompare = levels[i];
        var isLast = i==levels.length-1;
        var searchMatches = $self.matches.find(v=>v.DOMel == elToCompare);
        var found = (!inverse && searchMatches &&
            $self.source.documentElement.contains(searchMatches.match) &&
            searchMatches.match) ||
            isEqualNode(startLevel,elToCompare,isLast,relax);
        if(!found)
            break;
        startLevel = found;
        if(i==levels.length-1)
            elementToChange = found;
    }
    elementToChange && !$self.matches.find(v=>v.DOMel == el) &&
        $self.matches.push({
            match : elementToChange,
            DOMel : el
        });
    return elementToChange;
};