import { CARD_CLICK_EXCLUDE_SELECTOR } from "./config.js";
import { setText } from "./utils.js";
import { initSlider } from "./slider.js";

/**
 * @param  {HTMLTemplateElement} cardTemplate
 * @param  {Object}              product
 * @param  {number}              index
 * @returns {Element}
 */
export function buildCard(cardTemplate, product, index) {
  let card = cardTemplate.content.firstElementChild.cloneNode(true);
  let galleryName = "product-gallery-" + (index + 1);

  setText(card, "[data-field='article']", product.article);
  setText(card, "[data-field='title']", product.title);
  setText(card, "[data-field='description']", product.description);
  setText(card, "[data-field='price']", product.price);
  setText(card, "[data-field='pricePerMeter']", product.pricePerMeter);
  setText(card, "[data-field='likes']", String(product.likes));

  buildSlides(card, product);
  buildMods(card, product);
  buildHiddenGallery(card, product, galleryName);

  card.setAttribute("data-gallery-name", galleryName);
  card.setAttribute("data-card-index", String(index));

  return card;
}

/**
 * @param  {Element} card
 * @param  {Object}  product
 * @param  {number}  index
 */
export function initCard(card, product, index) {
  let swiperInstance = initSlider(card);

  initCardClick(card);
  initLikeToggle(card);
  initModsToggle(card);
  initZoom(card, swiperInstance);

  card.setAttribute("data-product-title", product.title);
  card.setAttribute("data-product-article", product.article);
  card.setAttribute("data-instance-id", String(index + 1));
}

function buildSlides(card, product) {
  let slideTemplate = document.getElementById("card-slide-template");
  let wrapper = card.querySelector(".card__slider .swiper-wrapper");

  if (!slideTemplate || !wrapper) {
    return;
  }

  product.images.forEach(function (imageSrc, imageIndex) {
    let slide = slideTemplate.content.firstElementChild.cloneNode(true);
    let image = slide.querySelector(".card__image");

    image.src = imageSrc;
    image.alt = product.title + " - фото " + (imageIndex + 1);
    image.loading = imageIndex === 0 ? "eager" : "lazy";
    image.decoding = "async";

    wrapper.appendChild(slide);
  });
}

function buildMods(card, product) {
  let modTemplate = document.getElementById("card-mod-template");
  let modsList = card.querySelector(".card__mods-list");

  if (!modTemplate || !modsList) {
    return;
  }

  product.materials.forEach(function (material, materialIndex) {
    let modButton = modTemplate.content.firstElementChild.cloneNode(true);
    let modText = modButton.querySelector(".card__mod-text");

    modButton.setAttribute("data-material-id", material.id);
    modButton.setAttribute(
      "aria-pressed",
      materialIndex === 0 ? "true" : "false",
    );
    modText.textContent = material.name;

    if (materialIndex === 0) {
      modButton.classList.add("card__mod--active");
    }

    modsList.appendChild(modButton);
  });
}

function buildHiddenGallery(card, product, galleryName) {
  let gallery = card.querySelector(".card__gallery");

  if (!gallery) {
    return;
  }

  product.images.forEach(function (imageSrc, imageIndex) {
    let link = document.createElement("a");

    link.className = "card__gallery-link";
    link.href = imageSrc;
    link.dataset.fancybox = galleryName;
    link.dataset.caption = product.title + " • фото " + (imageIndex + 1);
    link.setAttribute(
      "aria-label",
      product.title + " фото " + (imageIndex + 1),
    );
    link.tabIndex = -1;

    gallery.appendChild(link);
  });
}

function initCardClick(card) {
  card.addEventListener("click", function (event) {
    let target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest(CARD_CLICK_EXCLUDE_SELECTOR)) {
      return;
    }

    window.open("/card", "_blank", "noopener,noreferrer");
  });

  let buyButton = card.querySelector(".card__buy");
  if (buyButton) {
    buyButton.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  let calcLink = card.querySelector(".card__calc");
  if (calcLink) {
    calcLink.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
}

function initLikeToggle(card) {
  let likeButton = card.querySelector(".card__like");
  let countEl = card.querySelector(".card__like-count");

  if (!likeButton || !countEl) {
    return;
  }

  likeButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    let isActive = likeButton.classList.toggle("card__like--active");
    let currentCount = parseInt(countEl.textContent || "0", 10) || 0;
    let nextCount = currentCount + (isActive ? 1 : -1);

    countEl.textContent = String(Math.max(nextCount, 0));
    likeButton.setAttribute(
      "aria-label",
      isActive ? "Убрать из избранного" : "Добавить в избранное",
    );
    likeButton.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function initModsToggle(card) {
  let modsList = card.querySelector(".card__mods-list");

  if (!modsList) {
    return;
  }

  modsList.addEventListener("click", function (event) {
    let target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    let clickedButton = target.closest(".card__mod");

    if (!clickedButton || !modsList.contains(clickedButton)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let currentActive = modsList.querySelector(".card__mod--active");

    if (currentActive === clickedButton) {
      return;
    }

    if (currentActive) {
      currentActive.classList.remove("card__mod--active");
      currentActive.setAttribute("aria-pressed", "false");
    }

    clickedButton.classList.add("card__mod--active");
    clickedButton.setAttribute("aria-pressed", "true");
  });
}

function initZoom(card, swiperInstance) {
  let zoomButton = card.querySelector(".card__zoom");

  if (!zoomButton) {
    return;
  }

  zoomButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    let links = card.querySelectorAll(".card__gallery-link");

    if (!links.length) {
      return;
    }

    let activeIndex = 0;

    if (swiperInstance && typeof swiperInstance.realIndex === "number") {
      activeIndex = swiperInstance.realIndex;
    }

    if (
      typeof window.Fancybox !== "undefined" &&
      typeof window.Fancybox.show === "function"
    ) {
      let slides = Array.prototype.map.call(links, function (link) {
        return {
          src: link.href,
          caption: link.dataset.caption || "",
        };
      });

      window.Fancybox.show(slides, { startIndex: activeIndex });
      return;
    }

    let targetLink = links[activeIndex] || links[0];

    if (targetLink) {
      targetLink.click();
    }
  });
}
