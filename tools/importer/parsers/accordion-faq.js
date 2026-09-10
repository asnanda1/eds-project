/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (accordion, 2 columns): row 1 = block name, then one row per item:
 *   col 1 = question label, col 2 = answer body.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details, .accordion-faq-item, details'));

  const cells = [];
  items.forEach((item) => {
    const label = item.querySelector('.accordion-faq-item-label, summary');
    const body = item.querySelector('.accordion-faq-item-body');

    const labelCell = label ? Array.from(label.childNodes) : '';
    const bodyCell = body ? Array.from(body.childNodes) : '';

    cells.push([labelCell, bodyCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
