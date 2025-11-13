onst path = require("path");
const fs = require("fs");
const logger = require("./logger");
require("dotenv").config();

/**
 * Load configuration from environment variables with sensible defaults.
 */
function loadConfig() {
  const config = {
    searchQuery: process.env.SEARCH_QUERY || "laptop",
    page: parseInt(process.env.SEARCH_PAGE || "1", 10),
    maxItems: parseInt(process.env.MAX_ITEMS || "20", 10),
    baseUrl: process.env.ALIBABA_BASE_URL || "https://www.alibaba.com",
    userAgent:
      process.env.HTTP_USER_AGENT ||
      "Mozilla/5.0 (compatible; BitbashAlibabaScraper/1.0; +https://bitbash.dev)",
    timeoutMs: parseInt(process.env.HTTP_TIMEOUT_MS || "15000", 10),
    outputFile: process.env.OUTPUT_FILE || "",
    logsDir: process.env.LOGS_DIR || path.join(process.cwd(), "logs")
  };

  if (!fs.existsSync(config.logsDir)) {
    try {
      fs.mkdirSync(config.logsDir, { recursive: true });
    } catch (err) {
      logger.warn("Failed to create logs directory, continuing anyway", {
        logsDir: config.logsDir,
        error: err.message
      });
    }
  }

  return config;
}

module.exports = {
  loadConfig
};