DROP TABLE IF EXISTS `properties_values`;
CREATE TABLE `properties_values` (
	`properties_values_id`    int(10) unsigned NOT NULL AUTO_INCREMENT,
	`properties_id`           int(10) unsigned NOT NULL DEFAULT '0',
	`sort_order`              int(10)          NOT NULL DEFAULT '0',
	`value_model`             varchar(64)      NOT NULL DEFAULT '',
	`weight`                  decimal(9, 4)    NOT NULL DEFAULT '0.0000',
	`value_price`             decimal(9, 4)    NOT NULL DEFAULT '0.0000',
	`display_image`           VARCHAR(256)     NOT NULL DEFAULT '',
	`stock_type`              VARCHAR(32)      NOT NULL DEFAULT 'not-managed',
	`stock`                   decimal(9, 4)    NOT NULL DEFAULT 0.0000,
	`stock_centrally_managed` int(1)           NOT NULL DEFAULT 0,
	PRIMARY KEY (`properties_values_id`),
	KEY `properties_values_id`(`properties_values_id`, `properties_id`, `sort_order`),
	KEY `properties_id`(`properties_id`, `sort_order`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `properties_values`
VALUES (1, 1, 1, 's', '0.0000', '0.0000', '', 'not-managed', '0.0000', 0),
	(2, 1, 2, 'm', '0.0000', '0.0000', '', 'not-managed', '0.0000', 0),
	(3, 1, 3, 'l', '0.0000', '5.0000', '', 'not-managed', '0.0000', 0),
	(4, 2, 1, 'gold', '0.0000', '0.0000', 'yellow.png', 'not-managed', '0.0000', 0),
	(5, 2, 2, 'red', '0.0000', '0.0000', 'red.png', 'not-managed', '0.0000', 0),
	(6, 2, 3, 'black', '0.0000', '2.0000', 'black.png', 'not-managed', '0.0000', 0),
	(7, 3, 1, 'ja', '0.0000', '5.0000', '', 'not-managed', '0.0000', 0),
	(8, 3, 2, 'nein', '0.0000', '0.0000', '', 'not-managed', '0.0000', 0),
	(9, 4, 1, 'html', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(10, 4, 2, 'pdf', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(11, 5, 1, '36', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(12, 5, 2, '37', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(13, 5, 3, '38', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(14, 5, 4, '39', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(15, 5, 5, '40', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(16, 5, 6, '41', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(17, 5, 7, '42', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(18, 5, 8, '43', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(19, 5, 9, '44', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(20, 5, 10, '45', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(21, 5, 11, '46', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(22, 6, 1, '5', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(23, 6, 2, '2', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0),
	(24, 6, 3, 'nein', '0.0000', '0.0000', '', 'only-positive', '0.0000', 0);