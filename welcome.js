(function () {
  var STORAGE_KEY = "cbi_skip_welcome";
  var SITE_PATH = "src/index.html";

  function goToSite() {
    var remember = document.getElementById("rememberWelcome");
    if (remember && remember.checked) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {
        /* ignore */
      }
    }
    window.location.href = SITE_PATH;
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        window.location.replace(SITE_PATH);
        return;
      }
    } catch (e) {
      /* ignore */
    }

    var btn = document.getElementById("welcomeEnter");
    if (btn) btn.addEventListener("click", goToSite);
  });
})();
