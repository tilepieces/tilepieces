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

function compareDocuments(matchObj) {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var htmltext = tilepieces.core.createDocumentText(doc);
  var htmlMatchText = tilepieces.core.createDocumentText(docSource);
  try {
    logOnDocument(
      assert(htmltext == htmlMatchText, "documents are equals"), "success");
    if (matchObj) {
      logOnDocument(
        assert(htmltext == matchObj.htmltext &&
          (!matchObj.htmlMatchText || htmlMatchText == matchObj.htmlMatchText)
          , "document are equals with the previous one")
        , "success");
    }
  } catch (e) {
    console.error("htmltext,htmlMatchText,matchObj", htmltext, htmlMatchText, matchObj);
    throw(e);
  }
  return {htmltext, htmlMatchText}
}

function componentModel(name, path) {
  return {
    name,
    description: "",
    version: "",
    author: "",
    website: "",
    repository: "",
    html: "",
    bundle: {
      "stylesheet": {},
      "script": {}
    },
    sources: {
      "stylesheets": [],
      "scripts": []
    },
    dependencies: [],
    miscellaneous: [],
    selector: "",
    interface: ""
  }
}

function eventsAsyncResolver(target, eventName, delayMs = 1000) {
  return new Promise((resolve, reject) => {
    var start = performance.now();
    var timeout;
    target.addEventListener(eventName, e => {
      //clearTimeout(timeout);
      logOnDocument(eventName + " performed in " + (performance.now() - start), "success");
      resolve(e);
    }, {once: true});
    timeout = setTimeout(() => {
      reject("event " + eventName + " has not been called in " + delayMs + "Ms.");
    }, delayMs)
  });
}

function getDocuments() {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var htmltext = tilepieces.core.createDocumentText(doc);
  var htmlMatchText = tilepieces.core.createDocumentText(docSource);
  return {htmltext, htmlMatchText}
}

function historyComparison(__historyFileRecord) {
  // __historyFileRecord.path is setted by currentPage, but not in test cases
  if (__historyFileRecord.path) {
    var currentStylePath = decodeURI(tilepieces.core.matchCurrentStyleSheetNode.href).replace(location.origin, "");
    logOnDocument(assert(currentStylePath == __historyFileRecord.path, "currentStylePath == __historyFileRecord.path")
      , "success");
    var currentStyleText = [...tilepieces.core.currentStyleSheet.cssRules].map(v => v.cssText).join("");
    logOnDocument(assert(currentStyleText == __historyFileRecord.text, "currentStyleSheet == __historyFileRecord.text")
      , "success");
  } else {
    logOnDocument(assert(compareDocuments({htmltext: __historyFileRecord.text}), "htmlfile == __historyFileRecord.text")
      , "success");
  }
}

function logError(e) {
  console.error(e);
  var errorToPrint = e.err || e.error || e.toString();
  logOnDocument(errorToPrint, "error");
  window.dispatchEvent(new CustomEvent("test-error", {
    detail: errorToPrint
  }))
}

const logSection = document.getElementById("log-section");

function logOnDocument(sentence, className) {
  var div = document.createElement("div");
  div.className = className || "";
  div.innerHTML = sentence;
  logSection.append(div);
  div.scrollIntoView();
}

function setTest(frameUrl, frameEl) {
  return new Promise((resolve, reject) => {
    try {
      tilepieces.workspace = "";
      let testFrameUrl = frameUrl || "test-frame.html";
      let frame = frameEl || document.getElementById("frame");
      frame.addEventListener("load", async () => {
        var html = await fetch(testFrameUrl);
        var htmlText = await html.text();
        tilepieces.core = await tilepiecesCore().init(frame.contentDocument, htmlText);
        resolve();
      });
      frame.addEventListener("error", (e) => {
        reject(e);
      });
      frame.src = testFrameUrl;
    } catch (e) {
      reject(e)
    }
  });
}

function setTestFramework(frameTarget, frameUrl, workspace = "") {
  return new Promise((resolve, reject) => {
    var cWin, cDoc, tilepieces;
    frameTarget.addEventListener("load", e => {
      try {
        cWin = frameTarget.contentWindow;
        cDoc = frameTarget.contentDocument;
        tilepieces = cWin.tilepieces;
        tilepieces.workspace = workspace;
        cWin.addEventListener("html-rendered", e => {
          resolve({e, cWin, cDoc, tilepieces});
        });
        tilepieces.setFrame(frameUrl);
      } catch (e) {
        reject(e)
      }
    });
    frameTarget.addEventListener("error", (e) => {
      reject(e);
    });
    frameTarget.src = "index.html";
  })
}
