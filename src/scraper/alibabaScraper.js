onst { buildSearchUrl, fetchHtml } = require("../httpClient");
const { parseProductList } = require("../parser/productParser");
const logger = require("../logger");

/**
* High-level function that performs a single search against Alibaba and
* returns a normalized list of products.
*/
async function scrapeAlibabaSearch(config) {
const { searchQuery, page, baseUrl, userAgent, timeoutMs, maxItems } = config;

const url = buildSearchUrl(baseUrl, searchQuery, page);
logger.info("Starting scrape", { url, searchQuery, page });

const html = await fetchHtml(url, { userAgent, timeoutMs });
if (!html) {
logger.warn("Empty HTML received from server", { url });
return [];
}

const products = parseProductList(html, { baseUrl });

const sliced = products.slice(0, maxItems);
logger.info("Scrape completed", {
totalParsed: products.length,
returned: sliced.length
});

return sliced;
}

module.exports = {
scrapeAlibabaSearch
};