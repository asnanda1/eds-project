/**
 * Hero CTA — full-bleed dark call-to-action banner.
 * Content model: two cells — an image cell (full-bleed, darkened background)
 * and a text cell with a heading, a paragraph, and a single CTA link.
 * @param {Element} block The hero-cta block element
 */
export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  const rows = [...block.children];
  const textRow = rows.find((row) => !row.querySelector('picture'));
  if (textRow) {
    const content = textRow.querySelector(':scope > div') || textRow;
    content.classList.add('hero-cta-content');
  }
}
