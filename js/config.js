export let CARD_CLICK_EXCLUDE_SELECTOR = [
  ".card__nav",
  ".card__pagination",

  ".card__zoom",

  ".card__like",
  ".card__buy",
  ".card__calc",
  ".card__mod",
].join(", ");

export let MOBILE_BREAKPOINT = 768;

export let mobileMedia = window.matchMedia("(max-width: 767px)");

export let cardSwipers = [];
