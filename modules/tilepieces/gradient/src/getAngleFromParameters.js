function getAngleFromParameters(parameters) {
  var p = parameters;
  var matchSideOrCorner = p.match(sideOrCorner);
  var angle = 180;
  if (matchSideOrCorner) {
    var token = "";
    while (matchSideOrCorner) {
      token += matchSideOrCorner[0];
      p = p.substring(matchSideOrCorner.index + matchSideOrCorner[0].length);
      matchSideOrCorner = p.match(sideOrCorner);
    }
    angle = token ? sideOrCornerMap[token] : 180;
  } else
    angle = degFromAngleDeclaration(parameters);
  return angle;
}