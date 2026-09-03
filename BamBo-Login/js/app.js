(() => {
  const app = window.BambooApp;
  const showToast = app.createToast();
  const panda = app.createPandaController();
  const form = app.createFormController(showToast);
  app.controllers = {
    panda,
    form,
    lamp: app.createLampController({ form, panda, showToast }),
  };
})();
