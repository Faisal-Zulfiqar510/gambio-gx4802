DROP TABLE IF EXISTS `products_attributes`;
CREATE TABLE `products_attributes` (
  `products_attributes_id` int(11) NOT NULL AUTO_INCREMENT,
  `products_id` int(11) NOT NULL DEFAULT '0',
  `options_id` int(11) NOT NULL DEFAULT '0',
  `options_values_id` int(11) NOT NULL DEFAULT '0',
  `options_values_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `price_prefix` char(1) NOT NULL DEFAULT '',
  `stock_type` varchar(16) NULL DEFAULT 'not-managed',
  `attributes_model` varchar(64) NOT NULL DEFAULT '',
  `attributes_stock` decimal(15,4) NOT NULL DEFAULT 0,
  `options_values_weight` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `weight_prefix` char(1) NOT NULL DEFAULT '',
  `sortorder` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`products_attributes_id`),
  KEY `products_id` (`products_id`,`options_id`,`options_values_id`,`sortorder`),
  KEY `options_values_id` (`options_values_id`),
  KEY `sortorder` (`sortorder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

INSERT INTO `products_attributes`
VALUES
	(1, 2, 4, 9, '0.0000', '+', 'not-managed', 'html', '99.0000', '0.0000', '+', 1),
	(2, 4, 6, 24, '0.0000', '+', 'not-managed', 'nein', '0.0000', '0.0000', '+', 1),
	(3, 4, 6, 23, '126.0420', '+', 'not-managed', '2', '0.0000', '0.0000', '+', 2),
	(4, 4, 6, 22, '252.0924', '+', 'not-managed', '5', '0.0000', '0.0000', '+', 3),
	(5, 4, 4, 10, '0.0000', '+', 'not-managed', 'pdf', '100.0000', '0.0000', '+', 4),
	(6, 4, 4, 9, '0.0000', '+', 'not-managed', 'html', '100.0000', '0.0000', '+', 5);