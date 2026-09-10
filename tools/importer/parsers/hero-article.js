/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article. Base: hero.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/blog/ace-pro-court-polo
 * Generated: 2026-09-10
 *
 * Structure (from library-description.txt): Hero is a 1-column, 3-row block.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: content cell — breadcrumb links, h1 title, and byline paragraphs
 */
export default function parse(element, { document }) {
  // Row 2: image cell — the article's lead picture/image
  const picture = element.querySelector('picture');
  const image = picture || element.querySelector('img');

  // Row 3: text content cell — breadcrumb paragraph (links), h1 title, byline paragraphs.
  // The text lives in the second cell of the source; select all direct headings/paragraphs
  // that are not part of the picture cell.
  const contentEls = Array.from(
    element.querySelectorAll('h1, h2, p'),
  ).filter((el) => !el.closest('picture'));

  // Empty-block guard: bail gracefully if there is no meaningful content.
  if (!image && contentEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background/lead image (optional)
  if (image) cells.push([image]);

  // Row 3: single content cell holding all text elements
  const contentCell = [];
  contentEls.forEach((el) => contentCell.push(el));
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
