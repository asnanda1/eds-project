/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base block: columns.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (columns): row 1 = block name, row 2 = 2 columns
 * (image column + text column with byline paragraph + heading).
 */
export default function parse(element, { document }) {
  // Column 1: image
  const image = element.querySelector('.columns-featured-img-col picture, .columns-featured-img-col img, picture, img');

  // Column 2: text (byline paragraph + heading)
  const byline = element.querySelector('p');
  const heading = element.querySelector('h1, h2, h3, [class*="title"]');

  // Empty-block guard
  if (!image && !byline && !heading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = image || '';

  const textCell = [];
  if (byline) textCell.push(byline);
  if (heading) textCell.push(heading);

  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
