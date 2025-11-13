# Optional: Change the user agent for HTTP requests
# HTTP_USER_AGENT=Mozilla/5.0 (compatible; BitbashAlibabaScraper/1.0; +https://bitbash.dev)

# HTTP timeout in milliseconds
HTTP_TIMEOUT_MS=15000

# Output file path. If empty, JSON is printed to stdout.
# OUTPUT_FILE=output.json

# Logs directory (created if it doesn't exist)
# LOGS_DIR=./logs

# Logging verbosity: debug | info | warn | error
LOG_LEVEL=info