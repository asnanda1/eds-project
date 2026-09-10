/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-team. Base: cards (no images).
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/about-us
 * Generated: 2026-09-10
 *
 * Library convention (cards, no images): 1 column, multiple rows. Row 1 = block
 * name. Each subsequent row = one card in a single cell: heading, description,
 * optional CTA. Text-only, no images.
 *
 * Source structure: <div class="employee-list block"> > <ul> > <li>, each <li>
 * has a <div class="employee-list-card-body"> containing an <h3> name,
 * a <p class="employee-list-card-title"> and a <p class="employee-list-card-department">.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll(':scope > ul > li');
  const cells = [];

  items.forEach((li) => {
    // Body wrapper holds name heading + title + department; fall back to the li.
    const body = li.querySelector('.employee-list-card-body') || li;
    const content = Array.from(body.children);

    if (content.length) {
      // 1-column row: single cell holding all of the card's elements.
      cells.push([content]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
