/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base: columns.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/faq
 * Generated: 2026-09-10
 *
 * Structure (2 columns, 1 content row):
 *   - Column 1: h2 heading + intro paragraph
 *   - Column 2: labelled contact details (h3 "Email" + mailto: link,
 *               h3 "Phone" + tel: link, h3 "Address" + text paragraph)
 * Emits AEM columns table: "columns-contact" header row, then one row with 2 cells.
 */
export default function parse(element, { document }) {
  // The block has a single row wrapping the column cells.
  // Prefer the direct row wrapper's children; fall back to the block's own children.
  const row = element.querySelector(':scope > div');
  const columnEls = row
    ? Array.from(row.querySelectorAll(':scope > div'))
    : Array.from(element.querySelectorAll(':scope > div'));

  // Build one cell per column, preserving headings, paragraphs, and links exactly.
  const columnCells = columnEls
    .map((col) => Array.from(col.childNodes).filter((node) => {
      // keep element nodes and non-empty text nodes
      if (node.nodeType === 1) return true;
      if (node.nodeType === 3) return node.textContent.trim().length > 0;
      return false;
    }))
    .filter((cellContent) => cellContent.length > 0);

  // Empty-block guard: bail gracefully if no column content was found.
  if (columnCells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Normalize to exactly 2 columns for this variant (pad short rows with an empty cell).
  while (columnCells.length < 2) columnCells.push('');

  const cells = [];
  cells.push(columnCells);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
