/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBlogParser from './parsers/hero-blog.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/eds-capstone-cleanup.js';
import sectionsTransformer from './transformers/eds-capstone-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-blog': heroBlogParser,
  'accordion-faq': accordionFaqParser,
  'columns-contact': columnsContactParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'faq',
  description: 'FAQ page: hero, Q&A accordion, pull-quote, contact columns, and accent closing CTA.',
  urls: [
    'https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/faq',
  ],
  blocks: [
    { name: 'hero-blog', instances: ['.hero-blog'] },
    { name: 'accordion-faq', instances: ['.accordion-faq'] },
    { name: 'columns-contact', instances: ['.columns-contact'] },
  ],
  sections: [
    { id: 's1', name: 'hero', selector: ['.hero-blog-container'], style: 'secondary', blocks: ['hero-blog'], defaultContent: [] },
    { id: 's2', name: 'faq', selector: ['.accordion-faq-container'], style: null, blocks: ['accordion-faq'], defaultContent: [] },
    { id: 's3', name: 'quote', selector: ['.quote-container'], style: null, blocks: [], defaultContent: ['.quote-container .default-content-wrapper'] },
    { id: 's4', name: 'contact', selector: ['.columns-contact-container'], style: 'secondary', blocks: ['columns-contact'], defaultContent: [] },
    { id: 's5', name: 'closing-cta', selector: ['main > div.accent.section'], style: 'accent', blocks: [], defaultContent: ['main > div.accent.section .default-content-wrapper'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path; map root/homepage URL to /index
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
