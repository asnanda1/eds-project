/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base block: tabs.
 * Source: https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/
 * Structure (tabs): row 1 = block name, then one row per tab with 2 columns:
 *   col 1 = tab label (avatar + name + role from the tab button),
 *   col 2 = tab panel content (avatar + name + role + quote).
 * Tab buttons and panels are siblings in the source; pair them by index.
 */
export default function parse(element, { document }) {
  const tabs = Array.from(element.querySelectorAll('.tabs-testimonial-tab, [class*="tab"]:not([class*="panel"]):not([class*="list"])'))
    .filter((el) => el.tagName === 'BUTTON');
  const panels = Array.from(element.querySelectorAll('.tabs-testimonial-panel, [class*="panel"]'));

  const cells = [];
  const rowCount = Math.max(tabs.length, panels.length);

  for (let i = 0; i < rowCount; i += 1) {
    const tab = tabs[i];
    const panel = panels[i];

    // Tab label cell: everything inside the button (avatar + name + role)
    const labelCell = tab ? Array.from(tab.childNodes) : '';

    // Panel content cell: inner content of the panel (avatar + name + role + quote)
    let panelCell = '';
    if (panel) {
      const inner = panel.querySelector(':scope > div') || panel;
      panelCell = Array.from(inner.childNodes);
    }

    cells.push([labelCell, panelCell]);
  }

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
