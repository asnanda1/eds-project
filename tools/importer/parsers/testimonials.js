/* eslint-disable */
/* global WebImporter */
/**
 * Parser for testimonials. Base block: cards.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (cards, 2 columns): row 1 = block name, then one row per testimonial:
 *   col 1 = avatar image, col 2 = text (quote paragraph, name, role).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > ul > li, :scope li'));

  const cells = [];
  items.forEach((li) => {
    const avatar = li.querySelector('.testimonials-avatar picture, .testimonials-avatar img, picture, img');
    const quote = li.querySelector('.testimonials-quote p, blockquote p, blockquote');
    const nameParts = Array.from(li.querySelectorAll('.testimonials-name p, figcaption p'));

    const avatarCell = avatar || '';

    const textCell = [];
    if (quote) textCell.push(quote);
    nameParts.forEach((p) => textCell.push(p));

    cells.push([avatarCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'testimonials', cells });
  element.replaceWith(block);
}
