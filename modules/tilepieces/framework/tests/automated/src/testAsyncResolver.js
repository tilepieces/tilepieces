export function testAsyncResolver(cb) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        cb();
        resolve();
      } catch (e) {
        reject(e)
      }
    }, 64)
  });
}