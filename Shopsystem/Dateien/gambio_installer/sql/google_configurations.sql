DROP TABLE IF EXISTS `google_configurations`;
CREATE TABLE `google_configurations` (
	`scope`         ENUM ("general", "auth", "adwords", "shopping", "analytics") NOT NULL,
	`option`        VARCHAR(255)                                                 NOT NULL,
	`value`         VARCHAR(255)                                                 NOT NULL,
	`last_modified` TIMESTAMP                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`scope`, `option`)
)
	ENGINE InnoDb DEFAULT CHAR SET `utf8`;

INSERT INTO `google_configurations` (`scope`, `option`, `value`) VALUES
	("general", "connection-status", "{\"value\": false}"),
	("general", "app-url", "{\"value\": \"https://googleservices.gambio.com/rc/index.html\"}"),
	("general", "api-url", "{\"value\": \"https://googleservices.gambio.com/rc/index.php/api/v1\"}"),
	("auth", "refresh-token", "{\"value\": \"\"}"),
	("auth", "access-token", "{\"value\": \"\"}"),
	("auth", "expiration-timestamp", "{\"value\": \"\"}"),
	("analytics", "ua-tracking-code", "{\"value\": \"\"}"),
	("analytics", "enabled", "{\"value\": false}"),
	("analytics", "anonymize-ip", "{\"value\": true}"),
	("analytics", "price-net", "{\"value\": true}"),
	("analytics", "box-impression-tracking", "{\"value\": true}"),
	("analytics", "listing-impression-tracking", "{\"value\": true}"),
	("analytics", "product-click-tracking", "{\"value\": true}"),
	("analytics", "product-details-tracking", "{\"value\": true}"),
	("analytics", "shopping-cart-tracking", "{\"value\": true}"),
	("analytics", "checkout-tracking", "{\"value\": true}"),
	("analytics", "dev-mode", "{\"value\": false}"),
	("analytics", "box-bestseller-name", "{\"value\": \"Bestseller Box\"}"),
	("analytics", "box-specials-name", "{\"value\": \"Specials Box\"}"),
	("analytics", "box-whats-new-name", "{\"value\": \"Whats New Box\"}"),
	("analytics", "list-bestseller-name", "{\"value\": \"Bestseller List\"}"),
	("analytics", "list-specials-name", "{\"value\": \"Specials List\"}"),
	("analytics", "list-new-products-name", "{\"value\": \"New Products List\"}"),
	("analytics", "list-whats-new-name", "{\"value\": \"Whats New List\"}"),
	("analytics", "list-available-soon-name", "{\"value\": \"Available Soon List\"}"),
	("analytics", "list-top-products-name", "{\"value\": \"Top Products List\"}"),
	("analytics", "gtag-js-file-name", "{\"value\": \"\"}"),
	("analytics", "analytics-js-file-name", "{\"value\": \"\"}"),
	("analytics", "ec-plugin-js-file-name", "{\"value\": \"\"}"),
	("adwords", "conversion-tracking-enabled", "{\"value\": false}"),
	("adwords", "conversion-id", "{\"value\": \"\"}"),
	("adwords", "conversion-name", "{\"value\": \"\"}"),
	("adwords", "conversion-action-id", "{\"value\": \"\"}");