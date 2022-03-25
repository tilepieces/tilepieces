function matchBackgrounds(cssBackgroundStyle) {
  var swap = cssBackgroundStyle;
  var cursor = 0;
  var tokens = [];
  var backgrounds = [];
  var background = "";
  var currentToken;
  while (cursor < swap.length) {
    var sub = swap.substring(cursor);
    if (sub[0] == '(') {
      var newcurrentToken = {start: cursor, childs: [], father: currentToken || tokens};
      if (currentToken && currentToken != tokens) {
        currentToken.childs.push(newcurrentToken);
        currentToken = newcurrentToken;
      } else {
        tokens.push(newcurrentToken);
        currentToken = newcurrentToken
      }
    }
    if (sub[0] == ')') {
      currentToken.end = cursor + 1;
      currentToken = currentToken.father;
    }
    if (sub[0] == "," && (!currentToken || currentToken == tokens)) {
      backgrounds.push(background.trim());
      background = "";
    } else if (cursor == swap.length - 1) {
      background += sub[0];
      backgrounds.push(background.trim());
    } else
      background += sub[0];
    cursor += 1;
  }
  return backgrounds;
}