import { products } from './data.js'
import { buildCard, initCard } from './card.js'


export function renderCatalog() {
	let grid = document.querySelector('[data-catalog-grid]')
	let cardTemplate = document.getElementById('product-card-template')

	if (!grid || !cardTemplate) {
		return
	}

	products.forEach(function (product, index) {
		let card = buildCard(cardTemplate, product, index)
		grid.appendChild(card)
		initCard(card, product, index)
	})
}
