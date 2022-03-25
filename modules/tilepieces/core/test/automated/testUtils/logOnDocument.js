const logSection = document.getElementById("log-section");

function logOnDocument(sentence, className) {
  var div = document.createElement("div");
  div.className = className || "";
  div.textContent = sentence;
  logSection.append(div);
  div.scrollIntoView();
}