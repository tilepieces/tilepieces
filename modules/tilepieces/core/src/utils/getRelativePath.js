function getRelativePath(absolutePathDoc, absolutePathSource) {
  // we don't need the starting "/", if there is
  if (absolutePathDoc[0] == "/")
    absolutePathDoc = absolutePathDoc.substring(1);
  if (absolutePathSource[0] == "/")
    absolutePathSource = absolutePathSource.substring(1);
  var common = commonPath(absolutePathDoc, absolutePathSource);
  absolutePathDoc = absolutePathDoc.replace(common, "");
  absolutePathSource = absolutePathSource.replace(common, "");
  var absolutePathDocSplit = absolutePathDoc.split("/");
  var arr = [];
  absolutePathDocSplit.forEach((v, i, a) => {
    if (i != a.length - 1)
      arr.push("../")
  });
  return arr.join("") + absolutePathSource
}