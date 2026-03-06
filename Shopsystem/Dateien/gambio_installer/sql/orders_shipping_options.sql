DROP TABLE IF EXISTS `orders_shipping_options`;
CREATE TABLE `orders_shipping_options` (
	`orders_shipping_options_id` int(11) NOT NULL AUTO_INCREMENT,
	`orders_id` int(11) NOT NULL,
	`key` varchar(32) NOT NULL,
	`value` varchar(128) NOT NULL,
	PRIMARY KEY (`orders_shipping_options_id`),
	UNIQUE KEY `orders_id_idx` (`orders_id`,`key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
