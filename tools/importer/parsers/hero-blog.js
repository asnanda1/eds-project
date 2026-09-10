/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-blog. Base block: hero.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (hero, 1 column): row 1 = block name, row 2 = background image,
 * row 3 = text content (h1 title + intro paragraph + CTA links).
 */
export default function parse(element, { document }) {
  // Background/hero image cell
  const image = element.querySelector('picture, img');

  // Text content: heading, intro paragraph(s), CTA links
  const heading = element.querySelector('h1, h2, [class*="title"]');
  const paragraphs = Array.from(element.querySelectorAll('p'))
    .filter((p) => !p.querySelector('a'));
  const ctaLinks = Array.from(element.querySelectorAll('a'));

  // Empty-block guard
  if (!heading && paragraphs.length === 0 && ctaLinks.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: background image (optional)
  if (image) cells.push([image]);

  // Row: text content (single cell holding all text elements)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  paragraphs.forEach((p) => contentCell.push(p));
  ctaLinks.forEach((a) => contentCell.push(a));
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
