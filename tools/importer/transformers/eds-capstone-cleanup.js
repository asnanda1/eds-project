/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: eds-capstone-sudhansu site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Removes non-authorable site chrome (global header/nav, footer) and any
 * empty trailing section wrapper, so the import contains only page-level
 * authorable content.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No modals/overlays/cookie banners present in captured DOM.
    // Header/footer live outside <main>; removal happens in afterTransform.
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (verified in cleaned.html):
    //   <header class="header-wrapper"> ... <nav id="nav"> (brand, nav-sections, nav-tools/search)
    //   <footer class="footer-wrapper"> ... copyright + legal links
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.header-wrapper',
      'footer',
      '.footer-wrapper',
    ]);

    // Trailing empty section wrapper at end of <main> (verified: <div class="section"></div>).
    // Only remove sections that have no meaningful content, to avoid touching authorable content.
    element.querySelectorAll('main > div.section, div.section').forEach((sec) => {
      if (sec.textContent.trim() === '' && sec.querySelectorAll('img, picture, a, iframe').length === 0) {
        sec.remove();
      }
    });
  }
}
