// https://stackoverflow.com/questions/33704791/how-do-i-uninstall-a-service-worker
function unregisterSw() {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        try {
          for (let registration of registrations) {
            var scriptUrl = registration.scriptURL;
            tilepieces.serviceWorkers.indexOf(scriptUrl) < 0 &&
            registration.unregister()
          }
        } catch (e) {
          reject(e)
        }
        resolve();
      }, reject)
  })
}