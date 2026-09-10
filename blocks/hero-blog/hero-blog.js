/**
 * Hero Blog — full-bleed editorial hero.
 * Content model: two cells — an image cell and a text cell
 * (headline + intro paragraph + up to two CTA links). The image becomes a
 * full-bleed background; the text cell overlays it, left-aligned.
 * @param {Element} block The hero-blog block element
 */
export default function decorate(block) {
  // No image authored → fall back to a solid, on-text-color hero.
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Identify the text cell (the one without a picture) and group its CTAs so
  // the two links can be laid out side by side.
  const rows = [...block.children];
  const textRow = rows.find((row) => !row.querySelector('picture'));
  if (textRow) {
    const content = textRow.querySelector(':scope > div') || textRow;
    content.classList.add('hero-blog-content');

    const ctas = [...content.querySelectorAll('p')].filter(
      (p) => p.querySelector(':scope > a') && p.textContent.trim() === p.querySelector('a').textContent.trim(),
    );
    if (ctas.length) {
      const actions = document.createElement('p');
      actions.className = 'hero-blog-actions';
      ctas.forEach((p) => actions.append(p.querySelector('a')));
      ctas[0].replaceWith(actions);
      ctas.slice(1).forEach((p) => p.remove());
    }
  }
}
