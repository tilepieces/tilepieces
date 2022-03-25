(async function () {
  try {
    await deleteProject();
    await createProject();
    await updateRead();
    await search();
    await copy();
    await deleteFiles();
    await createComponentFromProject();
    await createComponentWithFiles();
    await projectReading();
    await deleteComponents();
    await settings();
    await deleteProject();
  } catch (e) {
    console.error(e);
    logOnDocument(e.err || e.error || e.toString(), "error");
  }
})();