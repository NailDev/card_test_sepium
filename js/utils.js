/**
 * @param {Element} root
 * @param {string}  selector
 * @param {string}  value
 */
export function setText(root, selector, value) {
  let el = root.querySelector(selector);

  if (el) {
    el.textContent = value;
  }
}
