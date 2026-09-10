/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBlogParser from './parsers/hero-blog.js';
import cardsValueParser from './parsers/cards-value.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsTeamParser from './parsers/cards-team.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/eds-capstone-cleanup.js';
import sectionsTransformer from './transformers/eds-capstone-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-blog': heroBlogParser,
  'cards-value': cardsValueParser,
  'columns-featured': columnsFeaturedParser,
  'accordion-faq': accordionFaqParser,
  'cards-team': cardsTeamParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'About Us page: hero, who-we-are prose, values card grid, our-story columns, FAQ accordion, and team roster.',
  urls: [
    'https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/about-us',
  ],
  blocks: [
    { name: 'hero-blog', instances: ['.hero'] },
    { name: 'cards-value', instances: ['.cards'] },
    { name: 'columns-featured', instances: ['.columns'] },
    { name: 'accordion-faq', instances: ['.accordion'] },
    { name: 'cards-team', instances: ['.employee-list'] },
  ],
  sections: [
    { id: 's1', name: 'hero', selector: ['.hero-container'], style: 'dark', blocks: ['hero-blog'], defaultContent: [] },
    { id: 's2', name: 'who-we-are', selector: ['main > div.section:nth-of-type(2)'], style: null, blocks: [], defaultContent: ['main > div.section:nth-of-type(2) .default-content-wrapper'] },
    { id: 's3', name: 'our-values', selector: ['.cards-container'], style: null, blocks: ['cards-value'], defaultContent: ['.cards-container .default-content-wrapper'] },
    { id: 's4', name: 'our-story', selector: ['.columns-container'], style: null, blocks: ['columns-featured'], defaultContent: [] },
    { id: 's5', name: 'faq', selector: ['.accordion-container'], style: null, blocks: ['accordion-faq'], defaultContent: ['.accordion-container .default-content-wrapper'] },
    { id: 's6', name: 'team', selector: ['.employee-list-container'], style: null, blocks: ['cards-team'], defaultContent: [] },
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
