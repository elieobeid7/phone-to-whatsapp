// Registering ServiceWorker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (registration) {
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    })
    .catch(function (err) {
      console.log("ServiceWorker registration failed: ", err);
    });
}

let deferredPrompt;
let installSource;

window.addEventListener("beforeinstallprompt", (e) => {
  deferredPrompt = e;
  installSource = "nativeInstallCard";

  e.userChoice.then(function (choiceResult) {
    if (choiceResult.outcome === "accepted") {
      deferredPrompt = null;
    }
  });
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
});
