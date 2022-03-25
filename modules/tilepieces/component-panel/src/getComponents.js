function changeComponents() {
  componentTemplate.set("components", turnComponentsToArray(app.localComponents) || [])
}

opener.addEventListener("project-setted", changeComponents);
opener.addEventListener("settings-updated", changeComponents);