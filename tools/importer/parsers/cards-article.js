/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (cards, 2 columns): row 1 = block name, then one row per card:
 *   col 1 = image, col 2 = body (date paragraph + linked title).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > ul > li, :scope li'));

  const cells = [];
  items.forEach((li) => {
    const image = li.querySelector('.cards-article-card-image picture, .cards-article-card-image img, picture, img');
    const body = li.querySelector('.cards-article-card-body');

    const imageCell = image || '';
    const bodyCell = body ? Array.from(body.childNodes) : '';

    cells.push([imageCell, bodyCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
