/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta. Base block: hero.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (hero, 1 column): row 1 = block name, row 2 = background image,
 * row 3 = text content (h2 heading + paragraph + single CTA link).
 */
export default function parse(element, { document }) {
  // Background/hero image cell
  const image = element.querySelector('picture, img');

  // Text content: heading, paragraph(s), CTA link
  const heading = element.querySelector('h1, h2, h3, [class*="title"]');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
