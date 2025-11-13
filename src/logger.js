onst LEVELS = ["debug", "info", "warn", "error"];

function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

function shouldLog(level) {
  const envLevel = process.env.LOG_LEVEL || "info";
  const currentIdx = LEVELS.indexOf(envLevel);
  const levelIdx = LEVELS.indexOf(level);
  if (currentIdx === -1 || levelIdx === -1) return true;
  return levelIdx >= currentIdx;
}

function log(level, message, meta) {
  if (!shouldLog(level)) return;
  const ts = formatTimestamp();
  const payload = {
    level,
    time: ts,
    message,
    ...(meta && typeof meta === "object" ? { meta } : {})
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

module.exports = {
  debug: (msg, meta) => log("debug", msg, meta),
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta)
};