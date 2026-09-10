/**
 * Hero Article — blog-post header.
 *
 * Content model: a lead image followed by a text block containing a breadcrumb
 * paragraph (links), the H1 title, and stacked byline metadata paragraphs
 * (author label, author, date, separator, read time, category). The image and
 * text may live in the same row or in separate rows.
 *
 * The source renders this header as default content, so decoration here is
 * intentionally light: it only adds class hooks (without restructuring the DOM
 * or changing document flow) so the block can be targeted and extended.
 *
 * @param {Element} block The hero-article block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  if (imageCell) imageCell.classList.add('hero-article-image');

  const textCell = cells.find((c) => c !== imageCell && c.querySelector('h1'))
    || cells.find((c) => c !== imageCell);
  if (!textCell) return;
  textCell.classList.add('hero-article-content');

  // Breadcrumb: the first paragraph made up only of links.
  const firstP = textCell.querySelector('p');
  if (firstP && firstP.querySelector('a')) {
    firstP.classList.add('hero-article-breadcrumb');
  }

  // Tag the byline paragraphs (everything after the H1) without moving them,
  // so the default paragraph flow/spacing that matches the source is preserved.
  const title = textCell.querySelector('h1');
  if (title) {
    let node = title.nextElementSibling;
    while (node) {
      if (node.tagName === 'P') node.classList.add('hero-article-meta');
      node = node.nextElementSibling;
    }
  }
}
