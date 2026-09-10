import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards Value — value/feature cards (icon or image + bold title + description).
 * Content model: each row is one card with an image cell and a body cell
 * (a bold title paragraph and a description paragraph).
 * @param {Element} block The cards-value block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-value-card-image';
      else div.className = 'cards-value-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
