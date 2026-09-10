/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBlogParser from './parsers/hero-blog.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import testimonialsParser from './parsers/testimonials.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroCtaParser from './parsers/hero-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/eds-capstone-cleanup.js';
import sectionsTransformer from './transformers/eds-capstone-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-blog': heroBlogParser,
  'columns-featured': columnsFeaturedParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  testimonials: testimonialsParser,
  'accordion-faq': accordionFaqParser,
  'hero-cta': heroCtaParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blog',
  description: 'Blog landing / listing pages (homepage + /blog) with hero, featured story, galleries, testimonials, articles, FAQ, and closing CTA.',
  urls: [
    'https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/',
    'https://main--eds-capstone-sudhansu--sudhansu-acharya.aem.live/blog',
  ],
  blocks: [
    { name: 'hero-blog', instances: ['.hero-blog'] },
    { name: 'columns-featured', instances: ['.columns-featured'] },
    { name: 'cards-gallery', instances: ['.cards-gallery'] },
    { name: 'tabs-testimonial', instances: ['.tabs-testimonial'] },
    { name: 'cards-article', instances: ['.cards-article'] },
    { name: 'testimonials', instances: ['.testimonials'] },
    { name: 'accordion-faq', instances: ['.accordion-faq'] },
    { name: 'hero-cta', instances: ['.hero-cta'] },
  ],
  sections: [
    { id: 's1', name: 'hero', selector: ['.hero-blog-container'], style: 'secondary', blocks: ['hero-blog'], defaultContent: [] },
    { id: 's2', name: 'featured-story', selector: ['.columns-featured-container'], style: null, blocks: ['columns-featured'], defaultContent: [] },
    { id: 's3', name: 'gallery', selector: ['.cards-gallery-container'], style: 'secondary', blocks: ['cards-gallery'], defaultContent: ['.cards-gallery-container .default-content-wrapper'] },
    { id: 's4', name: 'tabbed-testimonials', selector: ['.tabs-testimonial-container'], style: null, blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 's5', name: 'latest-articles', selector: ['.cards-article-container'], style: 'secondary', blocks: ['cards-article'], defaultContent: ['.cards-article-container .default-content-wrapper'] },
    { id: 's6', name: 'community-testimonials', selector: ['.testimonials-container'], style: null, blocks: ['testimonials'], defaultContent: ['.testimonials-container .default-content-wrapper'] },
    { id: 's7', name: 'faq', selector: ['.accordion-faq-container'], style: null, blocks: ['accordion-faq'], defaultContent: ['.accordion-faq-container .default-content-wrapper'] },
    { id: 's8', name: 'closing-cta', selector: ['.hero-cta-container'], style: 'inverse', blocks: ['hero-cta'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
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
 * @param {Document} document
 * @param {Object} template - PAGE_TEMPLATE
 * @returns {Array} block instances found on the page
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
