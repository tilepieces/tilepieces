function eventsAsyncResolver(target, eventName, delayMs = 1000) {
  return new Promise((resolve, reject) => {
    var start = performance.now();
    var timeout;
    var innerFunction = e => {
      clearTimeout(timeout);
      logOnDocument(eventName + " performed in " + (performance.now() - start), "success");
      resolve(e);
    }
    target.addEventListener(eventName, innerFunction, {once: true});
    timeout = setTimeout(() => {
      target.removeEventListener(eventName, innerFunction, {once: true});
      reject("event " + eventName + " has not been called in " + delayMs + "Ms.");
    }, delayMs)
  });
}