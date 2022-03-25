function assert(condition, testDescription) {
  if (!condition)
    throw new Error("[assertion failed] - " + testDescription);
  else {
    var successSentence = "[assertion passed] - " + testDescription;
    console.log(successSentence);
    return successSentence;
  }
}

if (typeof window === "undefined")
  module.exports = assert;