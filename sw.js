const swBlob = new Blob([swCode], {type: 'application/javascript'});
const swURL = URL.createObjectURL(swBlob);
navigator.serviceWorker.register(swURL)
