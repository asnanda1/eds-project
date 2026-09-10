/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base block: cards.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Image-only gallery: each source <li> is one card holding a single image.
 * Structure: row 1 = block name, then one row per image (single cell each).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > ul > li, :scope li'));

  const cells = [];
  items.forEach((li) => {
    const image = li.querySelector('picture, img');
    if (image) cells.push([image]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
