onst fs = require("fs");
const path = require("path");
const { loadConfig } = require("./config");
const logger = require("./logger");
const { scrapeAlibabaSearch } = require("./scraper/alibabaScraper");

async function main() {
const config = loadConfig();

// Allow overriding search query via CLI args as well.
const args = process.argv.slice(2);
if (args[0]) {
config.searchQuery = args.join(" ");
}

logger.info("Alibaba scraper starting", {
searchQuery: config.searchQuery,
page: config.page,
maxItems: config.maxItems
});

try {
const products = await scrapeAlibabaSearch(config);

const output = {
searchQuery: config.searchQuery,
page: config.page,
scrapedAt: new Date().toISOString(),
itemCount: products.length,
items: products
};

const json = JSON.stringify(output, null, 2);

if (config.outputFile) {
const outPath = path.resolve(config.outputFile);
fs.writeFileSync(outPath, json, "utf8");
logger.info("Results written to file", { outputFile: outPath });
} else {
// Print to stdout for piping
// eslint-disable-next-line no-console
console.log(json);
}

logger.info("Alibaba scraper finished successfully");
} catch (error) {
logger.error("Alibaba scraper failed", { error: error.message });
process.exitCode = 1;
}
}

if (require.main === module) {
main();
}