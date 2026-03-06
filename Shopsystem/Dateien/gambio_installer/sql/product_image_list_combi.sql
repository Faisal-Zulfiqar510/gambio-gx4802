DROP TABLE IF EXISTS `product_image_list_combi`;
CREATE TABLE `product_image_list_combi` (
	`products_properties_combis_id` int(11) NOT NULL,
	`product_image_list_id`         int(11) NOT NULL,
	PRIMARY KEY (`products_properties_combis_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `product_image_list_combi` (`products_properties_combis_id`, `product_image_list_id`)
VALUES (1, 1),
	(2, 2),
	(3, 3),
	(4, 1),
	(5, 2),
	(6, 3),
	(7, 1),
	(8, 2),
	(9, 3),
	(10, 4),
	(11, 4),
	(12, 4),
	(13, 4),
	(14, 4),
	(15, 4),
	(16, 4),
	(17, 4),
	(18, 4),
	(19, 4),
	(20, 4),
	(21, 5),
	(22, 5),
	(23, 5),
	(24, 5),
	(25, 5),
	(26, 5),
	(27, 5),
	(28, 5),
	(29, 5),
	(30, 5),
	(31, 5),
    (32, 7),
    (33, 6);