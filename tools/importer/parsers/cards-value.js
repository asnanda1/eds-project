/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-value. Base: cards.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/about-us
 * Generated: 2026-09-10
 *
 * Library convention (cards): 2 columns, multiple rows. Row 1 = block name.
 * Each subsequent row = one card: cell 1 = image/icon (mandatory),
 * cell 2 = text content (title as heading, description, optional CTA).
 *
 * Source structure: <div class="cards block"> > <ul> > <li>, each <li> has two
 * <div class="cards-card-body"> cells:
 *   - image cell: contains img/picture (prefer the valid <picture> over any broken img)
 *   - body cell: <p><strong>title</strong></p> + <p>description</p>
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll(':scope > ul > li');
  const cells = [];

  items.forEach((li) => {
    // Prefer the responsive <picture> (valid src); fall back to a plain <img>.
    const image = li.querySelector('picture') || li.querySelector('img');

    // Body cell = the child div holding the bold title / description (contains
    // a <strong> and no image), or defensively any non-image div.
    let bodyDiv = null;
    li.querySelectorAll(':scope > div').forEach((div) => {
      if (bodyDiv) return;
      const hasImage = div.querySelector('picture, img');
      if (div.querySelector('strong') || !hasImage) bodyDiv = div;
    });

    const imageCell = [];
    if (image) imageCell.push(image);

    const bodyCell = bodyDiv ? Array.from(bodyDiv.children) : [];

    // Emit a row only when there is meaningful content.
    if (imageCell.length || bodyCell.length) {
      cells.push([imageCell, bodyCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-value', cells });
  element.replaceWith(block);
}
