import { renderCatalog } from "./js/catalog.js";
import { initFancybox } from "./js/fancybox.js";
import { bindViewportAutoplaySync } from "./js/slider.js";

document.addEventListener("DOMContentLoaded", function () {
  renderCatalog();
  initFancybox();
  bindViewportAutoplaySync();
});
