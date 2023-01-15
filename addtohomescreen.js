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
  document.querySelector(".install-app-btn-container").style.visibility =
    "visible";
  deferredPrompt = e;
  installSource = "nativeInstallCard";

  e.userChoice.then(function (choiceResult) {
    if (choiceResult.outcome === "accepted") {
      deferredPrompt = null;
    }
  });
});

const installApp = document.getElementById("installApp");

installApp.addEventListener("click", async () => {
  installSource = "customInstallationButton";

  if (deferredPrompt !== null) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      deferredPrompt = null;
    }
  }
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
});
