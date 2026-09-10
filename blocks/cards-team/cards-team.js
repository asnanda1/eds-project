/**
 * Cards Team — text-only people cards (name + title + department).
 * Content model: each row is one person; the body cell holds a name heading,
 * a job-title paragraph, and a department paragraph.
 * @param {Element} block The cards-team block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'cards-team-card-body';
      // Tag the supporting lines after the name for styling.
      const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const paras = [...div.querySelectorAll('p')];
        if (paras[0]) paras[0].classList.add('cards-team-card-title');
        if (paras[1]) paras[1].classList.add('cards-team-card-department');
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
