function equalsCssValues(key, valueStored, valueWritten) {
  var equal0 = valueWritten == "0" && valueStored == "0px";
  var equalWithoutQuotationsMarks = key == "font-family" &&
    valueStored.replace(/'|"/g, "") == valueWritten.replace(/'|"/g, "");
  return equal0 || equalWithoutQuotationsMarks;
}