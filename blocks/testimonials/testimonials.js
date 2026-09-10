import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Testimonials — quote cards with a circular avatar, a quote, and a name/role.
 * Content model: each row is one testimonial with two cells —
 *   1) an avatar image, 2) a text cell whose first paragraph is the quote and
 *   the remaining paragraphs are the attribution (name, then role).
 * @param {Element} block The testimonials block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    figure.className = 'testimonials-card';

    // Avatar (first cell containing a picture)
    const avatarCell = cells.find((c) => c.querySelector('picture'));
    if (avatarCell) {
      const avatar = document.createElement('div');
      avatar.className = 'testimonials-avatar';
      const pic = avatarCell.querySelector('picture');
      avatar.append(pic);
      figure.append(avatar);
    }

    // Text cell = everything that isn't the avatar
    const textCell = cells.find((c) => c !== avatarCell) || cells[cells.length - 1];
    const paras = textCell ? [...textCell.querySelectorAll('p')] : [];

    if (paras.length) {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'testimonials-quote';
      blockquote.append(paras[0]);
      figure.append(blockquote);
    }

    if (paras.length > 1) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'testimonials-name';
      paras.slice(1).forEach((p) => figcaption.append(p));
      figure.append(figcaption);
    }

    li.append(figure);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
