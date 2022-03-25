import {testAsyncResolver} from './testAsyncResolver.js';

export async function screenDimensions(e, cWin, cDoc, tilepieces) {
  logOnDocument("Screen Dimensions", "larger");
  var screenDimensionTrigger = cDoc.getElementById("screen-dimensions-trigger");
  var screenDimensions = cDoc.getElementById("screen-dimensions");
  var targetFrameWrapper = cDoc.getElementById("target-frame-wrapper");
  screenDimensionTrigger.click();
  logOnDocument(assert(
    screenDimensions.style.display == "block",
    "clicking on #screen-dimensions-trigger will put a display:block on #screen-dimensions"), "success");

  var screenDimensionsWidth = screenDimensions.querySelector("#width");
  var screenDimensionsHeight = screenDimensions.querySelector("#height");
  var originalWidth = tilepieces.frame.contentWindow.innerWidth;
  var originalHeight = tilepieces.frame.contentWindow.innerHeight;
  await testAsyncResolver(() => {
    logOnDocument(assert(
      +screenDimensionsWidth.value == originalWidth &&
      +screenDimensionsHeight.value == originalHeight &&
      targetFrameWrapper.offsetWidth == originalWidth &&
      targetFrameWrapper.offsetHeight == originalHeight,
      "width and height field are correctly valued with the frame width and height expression in px. The wrapper has the same measure"), "success");
  });
  var newWidth = originalWidth + 500;
  screenDimensionsWidth.value = newWidth;
  screenDimensionsWidth.dispatchEvent(new Event("change"));
  var newHeight = originalHeight + 500;
  screenDimensionsHeight.value = newHeight;
  screenDimensionsHeight.dispatchEvent(new Event("change"));
  await testAsyncResolver(() => {
    logOnDocument(assert(
      tilepieces.frame.contentWindow.innerWidth == newWidth &&
      newHeight == tilepieces.frame.contentWindow.innerHeight &&
      targetFrameWrapper.offsetWidth == originalWidth &&
      targetFrameWrapper.offsetHeight == originalHeight,
      "adding 500px to width and height and the frame window.inner(Measure) seems to resize accordingly. The wrapper didn't change its measures"), "success");
  });
  logOnDocument("(tester should look if the frame is scrollable when larger than is wrapper)");
  var selectPredefinedDim = screenDimensions.querySelector("#screen-dimensions-default");
  var defaultOption = selectPredefinedDim.querySelector("option[value='414x896']");
  logOnDocument(assert(
    defaultOption,
    "the 'select' element of predefined values has the dimension we need for test"), "success");
  selectPredefinedDim.value = "414x896";
  selectPredefinedDim.dispatchEvent(new Event("change"));
  await testAsyncResolver(() => {
    logOnDocument(assert(
      tilepieces.frame.contentWindow.innerWidth == 414 &&
      896 == tilepieces.frame.contentWindow.innerHeight &&
      targetFrameWrapper.offsetWidth == originalWidth &&
      targetFrameWrapper.offsetHeight == originalHeight,
      "frame has changed accordingly"), "success");
  });
  var reverseButton = screenDimensions.querySelector("#reverse");
  reverseButton.click();
  await testAsyncResolver(() => {
    logOnDocument(assert(
      tilepieces.frame.contentWindow.innerWidth == 896 &&
      414 == tilepieces.frame.contentWindow.innerHeight &&
      targetFrameWrapper.offsetWidth == originalWidth &&
      targetFrameWrapper.offsetHeight == originalHeight,
      "clicking on the 'reverse' button had reversed the values, as expected"), "success");
  });
  var fitToScreen = screenDimensions.querySelector("#fit-to-screen-button");
  fitToScreen.click();
  await testAsyncResolver(() => {
    logOnDocument(assert(
      +screenDimensionsWidth.value == originalWidth &&
      +screenDimensionsHeight.value == originalHeight &&
      tilepieces.frame.style.width == "" &&
      tilepieces.frame.style.height == "" &&
      targetFrameWrapper.offsetWidth == originalWidth &&
      targetFrameWrapper.offsetHeight == originalHeight,
      "Fit to screen button has changed the measures to fit the screen ( original value ). It remove the tilepieces.frame.style.width and tilepieces.frame.style.height"), "success");
  });
  screenDimensionTrigger.click();
  logOnDocument(assert(
    screenDimensions.style.display == "none",
    "clicking on #screen-dimensions-trigger will put a display:none on #screen-dimensions"), "success");
}