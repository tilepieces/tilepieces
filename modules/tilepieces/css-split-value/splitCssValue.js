function splitCssValue(cssStyle){
    var swap = cssStyle;
    var cursor = 0;
    var tokens = [];
    var values = [];
    var value = "";
    var currentToken;
    while(cursor < swap.length) {
        var sub = swap.substring(cursor);
        if (sub[0] == '(') {
            var newcurrentToken = {start: cursor,childs:[],father:currentToken||tokens};
            if(currentToken && currentToken!=tokens) {
                currentToken.childs.push(newcurrentToken);
                currentToken = newcurrentToken;
            }
            else {
                tokens.push(newcurrentToken);
                currentToken = newcurrentToken
            }
        }
        if(sub[0] == ')'){
            currentToken.end=cursor+1;
            currentToken = currentToken.father;
        }
        if(sub[0] == "," && (!currentToken || currentToken==tokens)){
            values.push(value.trim());
            value = "";
        }
        else if(cursor == swap.length-1){
            value+=sub[0];
            values.push(value.trim());
        }
        else
            value+=sub[0];
        cursor+=1;
    }
    return values;
}