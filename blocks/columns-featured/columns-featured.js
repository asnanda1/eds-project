/**
 * Columns Featured — side-by-side image + editorial byline/heading teaser.
 * Content model: one row with two cells (image cell | text cell with byline + heading).
 * @param {Element} block The columns-featured block element
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-featured-${cols.length}-cols`);

  // Flag image-only columns so CSS can order/size them independently.
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-featured-img-col');
        }
      }
    });
  });
}
