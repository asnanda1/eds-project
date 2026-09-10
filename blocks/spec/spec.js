/*
 * Spec Block
 * A key/value specifications list. Each row is a label cell + value cell.
 * Rendered as a simple definition-style stack (label, then value beneath).
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('spec-row');
    const cells = [...row.children];
    if (cells[0]) cells[0].classList.add('spec-label');
    if (cells[1]) cells[1].classList.add('spec-value');
  });
}
