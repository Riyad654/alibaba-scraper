onst axios = require("axios");
const logger = require("./logger");
const { URLSearchParams } = require("url");

/**
* Build a search URL for Alibaba with the given base URL, query and page.
*/
function buildSearchUrl(baseUrl, searchQuery, page) {
const params = new URLSearchParams();
params.set("SearchText", searchQuery);
if (page > 1) {
params.set("page", String(page));
}
const separator = baseUrl.endsWith("/") ? "" : "/";
return `${baseUrl}${separator}trade/search?${params.toString()}`;
}

/**
* Fetch HTML from a URL with reasonable defaults and error handling.
*/
async function fetchHtml(url, options) {
const { userAgent, timeoutMs } = options;
logger.debug("Fetching URL", { url });

try {
const response = await axios.get(url, {
headers: {
"User-Agent": userAgent,
Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
},
timeout: timeoutMs
});

if (typeof response.data !== "string") {
logger.warn("Received non-string response body from URL", { url });
return "";
}

return response.data;
} catch (error) {
logger.error("HTTP request failed", {
url,
message: error.message,
code: error.code || null
});
throw new Error(`Failed to fetch URL: ${url}`);
}
}

module.exports = {
buildSearchUrl,
fetchHtml
};