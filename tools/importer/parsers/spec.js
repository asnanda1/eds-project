/* eslint-disable */
/* global WebImporter */
/**
 * Parser for spec. Base: table (custom block; no library convention).
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/blog/ace-pro-court-polo
 * Generated: 2026-09-10
 *
 * Structure: AEM table format.
 *   Row 1: block name ("spec")
 *   Rows 2..n: one row per label/value pair (2 columns) —
 *     label cell (strong text) + value cell (text).
 */
export default function parse(element, { document }) {
  // Each spec entry is a direct child <div> containing two cell <div>s:
  // the first holds the label (strong), the second holds the value.
  const rows = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];

  rows.forEach((row) => {
    const cellDivs = row.querySelectorAll(':scope > div');
    const labelCell = cellDivs[0];
    const valueCell = cellDivs[1];

    // Extract inner content of each cell, preserving semantic markup (e.g. <strong>).
    const label = labelCell
      ? (labelCell.querySelector('strong, p') || labelCell)
      : '';
    const value = valueCell
      ? (valueCell.querySelector('p') || valueCell)
      : '';

    // Only add rows that carry content; pad to keep 2 columns per row.
    if (label || value) {
      cells.push([label || '', value || '']);
    }
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'spec', cells });
  element.replaceWith(block);
}
