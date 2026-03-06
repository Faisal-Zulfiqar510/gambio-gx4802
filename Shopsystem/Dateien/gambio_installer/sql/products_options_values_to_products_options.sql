DROP TABLE IF EXISTS `products_options_values_to_products_options`;
CREATE TABLE `products_options_values_to_products_options` (
	`products_options_values_to_products_options_id` int(11) NOT NULL AUTO_INCREMENT,
	`products_options_id`                            int(11) NOT NULL DEFAULT '0',
	`products_options_values_id`                     int(11) NOT NULL DEFAULT '0',
	`options_id`                                     int(11) NOT NULL DEFAULT '0' COMMENT 'mirrors `properties`.`properties_id`',
	`option_value_id`                                int(11) NOT NULL DEFAULT '0' COMMENT 'mirrors `properties_values`.`properties_values_id`',
	PRIMARY KEY (`products_options_values_to_products_options_id`),
	KEY `products_options_id`(`products_options_id`),
	KEY `products_options_values_id`(`products_options_values_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;


INSERT INTO `products_options_values_to_products_options`
VALUES (1, 1, 1, 1, 1),
	(2, 1, 2, 1, 2),
	(3, 1, 3, 1, 3),
	(4, 2, 4, 2, 4),
	(5, 2, 5, 2, 5),
	(6, 2, 6, 2, 6),
	(7, 4, 9, 4, 9),
	(8, 4, 10, 4, 10),
	(9, 5, 11, 5, 11),
	(10, 5, 12, 5, 12),
	(11, 5, 13, 5, 13),
	(12, 5, 14, 5, 14),
	(13, 5, 15, 5, 15),
	(14, 5, 16, 5, 16),
	(15, 5, 17, 5, 17),
	(16, 5, 18, 5, 18),
	(17, 5, 19, 5, 19),
	(18, 5, 20, 5, 20),
	(19, 5, 21, 5, 21),
	(20, 6, 22, 6, 22),
	(21, 6, 23, 6, 23),
	(22, 6, 24, 6, 24),
	(23, 3, 7, 3, 7),
	(24, 3, 8, 3, 8);