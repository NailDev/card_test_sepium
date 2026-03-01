import { MOBILE_BREAKPOINT, mobileMedia, cardSwipers } from "./config.js";

/**
 * @param  {Element} card
 * @returns {Swiper|null}
 */
export function initSlider(card) {
  if (typeof window.Swiper === "undefined") {
    return null;
  }

  let sliderEl = card.querySelector(".card__slider");
  let prevEl = card.querySelector(".card__nav-button--prev");
  let nextEl = card.querySelector(".card__nav-button--next");
  let paginationEl = card.querySelector(".card__pagination");

  if (!sliderEl || !prevEl || !nextEl || !paginationEl) {
    return null;
  }

  let swiperInstance = new window.Swiper(sliderEl, {
    loop: true,
    speed: 500,
    slidesPerView: 1,
    watchOverflow: true,
    navigation: {
      prevEl: prevEl,
      nextEl: nextEl,
      enabled: !mobileMedia.matches,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    breakpoints: buildBreakpoints(prevEl, nextEl),
    on: {
      init: function (swiper) {
        syncAutoplay(swiper);
      },
      breakpoint: function (swiper) {
        syncAutoplay(swiper);
      },
      resize: function (swiper) {
        syncAutoplay(swiper);
      },
    },
  });

  cardSwipers.push(swiperInstance);
  card._swiper = swiperInstance;

  return swiperInstance;
}

export function bindViewportAutoplaySync() {
  let handler = function () {
    cardSwipers.forEach(function (swiperInstance) {
      syncAutoplay(swiperInstance);
    });
  };

  if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener("change", handler);
  } else if (typeof mobileMedia.addListener === "function") {
    mobileMedia.addListener(handler);
  }
}

function buildBreakpoints(prevEl, nextEl) {
  let result = {};

  result[0] = {
    navigation: { prevEl: prevEl, nextEl: nextEl, enabled: false },
  };

  result[MOBILE_BREAKPOINT] = {
    navigation: { prevEl: prevEl, nextEl: nextEl, enabled: true },
  };

  return result;
}

function syncAutoplay(swiperInstance) {
  if (!swiperInstance || !swiperInstance.autoplay) {
    return;
  }

  if (swiperInstance.navigation) {
    if (
      mobileMedia.matches &&
      typeof swiperInstance.navigation.disable === "function"
    ) {
      swiperInstance.navigation.disable();
    } else if (
      !mobileMedia.matches &&
      typeof swiperInstance.navigation.enable === "function"
    ) {
      swiperInstance.navigation.enable();
    }
  }

  if (mobileMedia.matches) {
    if (!swiperInstance.autoplay.running) {
      swiperInstance.autoplay.start();
    }
  } else if (swiperInstance.autoplay.running) {
    swiperInstance.autoplay.stop();
  }
}
