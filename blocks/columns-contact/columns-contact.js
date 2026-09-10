/**
 * Columns Contact — two-column contact block (intro text | contact details).
 * Content model: one row with two text cells — a heading + intro on one side,
 * and labelled contact details (email/phone/address, with mailto/tel links)
 * on the other. Stacks on mobile, side-by-side on desktop.
 * @param {Element} block The columns-contact block element
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-contact-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('columns-contact-col');
    });
  });
}
