buttonCreateDir.addEventListener("click", ev => {
  if (!pt || !pt.selected[0] || !pt.selected[0].hasAttribute("data-dir")) // dataset can't be reliable because data-dir could be empty
    return;
  var prompt = promptDialog({
    label: "New directory name:",
    buttonName: "CREATE",
    checkOnSubmit: true,
    patternFunction: (value, target) => {
      value = value.trim();
      return !value.match(/[()\/><?:%*"|\\]#+/);
    },
    patternExpl: "Directory name cannot contain /\\?%*:|\"<># characters"
  });
  prompt.events.on("submit",value=>createFile(null, true, value));
});