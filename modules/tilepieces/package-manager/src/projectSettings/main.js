projectsDialog.addEventListener("template-digest", async e => {
  var detail = e.detail;
  var target = detail.target;
  var isGeneralSettings = generalSettings.contains(target);
  var isCurrentProject = currentProjectData.contains(target);
  if (!isGeneralSettings && !isCurrentProject)
    return;
  var settingName = detail.stringModel.split(".").pop();
  var settingsValue = target.type == "checkbox"
    ? target.checked : target.value;
  if (isCurrentProject) {
    if (target.classList.contains("current-project-data__file-value")) {
      settingName = "files";
      settingsValue = projectsUIMOdel.project.files.map(v => v.value);
    }
    await app.changeSettings(settingName, settingsValue);
  } else
    await app.changeGlobalSettings(settingName, settingsValue);
  await app.getSettings();
});

document.querySelector(".current-project-data__add-files")
  .addEventListener("click", function (e) {
    projectsUIMOdel.project.files.push({value: "", index: projectsUIMOdel.project.files.length});
    projectsUITemplate.set("files", projectsUIMOdel.project.files);
  });
projectsDialog.addEventListener("click", async function (e) {
  if (!e.target.classList.contains("current-project-data__remove-files"))
    return;
  var index = e.target.dataset.index;
  var prFiles = projectsUIMOdel.project.files;
  prFiles.splice(index, 1);
  await app.changeSettings("files", prFiles.map(v => v.value));
  await app.getSettings();
  //projectsUITemplate.set("",projectsUIMOdel);
});