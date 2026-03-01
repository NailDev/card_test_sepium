export function initFancybox() {
  if (typeof window.Fancybox === "undefined") {
    return;
  }

  window.Fancybox.bind("[data-fancybox]", {
    groupAll: false,
    placeFocusBack: true,
  });
}
