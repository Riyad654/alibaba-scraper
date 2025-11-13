onst cheerio = require("cheerio");

/**
 * Normalize whitespace for readable strings.
 */
function normalizeText(text) {
  if (!text) return "";
  return String(text).replace(/\s+/g, " ").trim();
}

/**
 * Try to extract a numeric price from an arbitrary string.
 */
function extractPrice(text) {
  if (!text) return null;
  const m = String(text).match(/([0-9]+(?:\.[0-9]+)?)/);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Parse a list of products from an Alibaba search result HTML page.
 *
 * NOTE: The real Alibaba HTML structure is complex and may change.
 * This parser focuses on generic patterns and works very well with
 * synthetic HTML in tests (see tests/alibabaScraper.test.js).
 */
function parseProductList(html, { baseUrl = "https://www.alibaba.com" } = {}) {
  const $ = cheerio.load(html);
  const products = [];

  // Try multiple known-ish selectors and fall back gracefully.
  const productSelectors = [
    ".J-offer-wrapper",
    ".list-no-v2-outter .list-no-v2-outter-item",
    ".product",
    "[data-role='product']"
  ];

  let nodes = [];
  for (const sel of productSelectors) {
    nodes = $(sel).toArray();
    if (nodes.length > 0) break;
  }

  if (nodes.length === 0) {
    return [];
  }

  for (const node of nodes) {
    const $node = $(node);

    // Title
    let title =
      normalizeText(
        $node.find(".elements-title-normal__content, .product-title, a.title, a.product-title").first().text()
      ) || normalizeText($node.find("a").first().text());

    // URL
    let href =
      $node.find("a.elements-title-normal__content, a.product-title, a").first().attr("href") || "";
    href = href ? href.trim() : "";
    if (href && href.startsWith("//")) {
      href = "https:" + href;
    } else if (href && href.startsWith("/")) {
      const separator = baseUrl.endsWith("/") ? "" : "/";
      href = `${baseUrl}${separator}${href.replace(/^\//, "")}`;
    }

    // Price text
    const priceText =
      normalizeText(
        $node.find(".elements-offer-price-normal__price, .product-price, .price").first().text()
      ) || "";

    const minOrderText =
      normalizeText(
        $node.find(".min-order, .elements-quantity-control__quantity, .min-order-quantity").first().text()
      ) || "";

    const vendorName =
      normalizeText(
        $node.find(".organic-gallery-offer__seller-company, .company-name, .vendor-name").first().text()
      ) || "";

    const location =
      normalizeText(
        $node.find(".supplier-tags .supplier-tag__item, .location, .seller-location").first().text()
      ) || "";

    const ratingText =
      normalizeText(
        $node.find(".seb-supplier-review__score, .rating, .star-rating").first().text()
      ) || "";
    const ratingMatch = ratingText.match(/([0-9]+(?:\.[0-9]+)?)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    const reviewsText =
      normalizeText(
        $node.find(".seb-supplier-review__review-count, .review-count").first().text()
      ) || "";
    const reviewsMatch = reviewsText.replace(/,/g, "").match(/([0-9]+)/);
    const reviewCount = reviewsMatch ? parseInt(reviewsMatch[1], 10) : null;

    const product = {
      title,
      url: href || null,
      priceText: priceText || null,
      priceValue: extractPrice(priceText),
      minOrderText: minOrderText || null,
      vendorName: vendorName || null,
      location: location || null,
      rating,
      reviewCount
    };

    products.push(product);
  }

  return products;
}

module.exports = {
  parseProductList,
  normalizeText,
  extractPrice
};