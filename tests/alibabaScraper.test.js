onst test = require("node:test");
const assert = require("node:assert");
const { parseProductList, extractPrice, normalizeText } = require("../src/parser/productParser");

test("normalizeText collapses whitespace and trims", () => {
  assert.strictEqual(normalizeText("  Hello   World \n "), "Hello World");
  assert.strictEqual(normalizeText(""), "");
  assert.strictEqual(normalizeText(null), "");
});

test("extractPrice parses first numeric value", () => {
  assert.strictEqual(extractPrice("$10.50 - $12.00"), 10.5);
  assert.strictEqual(extractPrice("From 99 pcs / $3"), 99);
  assert.strictEqual(extractPrice("No price"), null);
});

test("parseProductList parses synthetic Alibaba-like HTML", () => {
  const html = `
    <div class="product">
      <a class="product-title" href="/product1.html">  Test Product 1  </a>
      <span class="price">US $10.50 - $12.00</span>
      <span class="min-order">10 pieces (Min. order)</span>
      <span class="vendor-name">Shenzhen Example Electronics Co., Ltd.</span>
      <span class="location">China</span>
      <span class="rating">4.6</span>
      <span class="review-count">23 Reviews</span>
    </div>
    <div class="product">
      <a class="product-title" href="/product2.html">Test Product 2</a>
      <span class="price">$5.00</span>
      <span class="min-order">1 piece</span>
      <span class="vendor-name">Guangzhou Another Vendor</span>
      <span class="location">China</span>
      <span class="rating">5.0</span>
      <span class="review-count">100</span>
    </div>
  `;

  const baseUrl = "https://www.alibaba.com";
  const products = parseProductList(html, { baseUrl });

  assert.ok(Array.isArray(products));
  assert.strictEqual(products.length, 2);

  const p1 = products[0];
  assert.strictEqual(p1.title, "Test Product 1");
  assert.strictEqual(p1.url, "https://www.alibaba.com/product1.html");
  assert.strictEqual(p1.priceText, "US $10.50 - $12.00");
  assert.strictEqual(p1.priceValue, 10.5);
  assert.strictEqual(p1.minOrderText, "10 pieces (Min. order)");
  assert.strictEqual(p1.vendorName, "Shenzhen Example Electronics Co., Ltd.");
  assert.strictEqual(p1.location, "China");
  assert.strictEqual(p1.rating, 4.6);
  assert.strictEqual(p1.reviewCount, 23);

  const p2 = products[1];
  assert.strictEqual(p2.title, "Test Product 2");
  assert.strictEqual(p2.url, "https://www.alibaba.com/product2.html");
  assert.strictEqual(p2.priceValue, 5);
  assert.strictEqual(p2.vendorName, "Guangzhou Another Vendor");
  assert.strictEqual(p2.reviewCount, 100);
});