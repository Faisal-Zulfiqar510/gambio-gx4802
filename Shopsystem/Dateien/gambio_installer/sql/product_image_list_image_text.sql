DROP TABLE IF EXISTS `product_image_list_image_text`;
CREATE TABLE `product_image_list_image_text` (
	`product_image_list_image_id`         int(11)      NOT NULL,
	`product_image_list_image_text_type`  varchar(16)  NOT NULL,
	`product_image_list_image_text_value` varchar(255) NOT NULL,
	`language_id`                         int(11)      NOT NULL DEFAULT '0',
	PRIMARY KEY (`product_image_list_image_id`, `language_id`, `product_image_list_image_text_type`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `product_image_list_image_text`
VALUES (1, 'alt_title', 'T-Shirt Yellow', 1),
	(1, 'title', 'T-Shirt Yellow', 1),
	(1, 'alt_title', 'T-Shirt Gelb', 2),
	(1, 'title', 'T-Shirt Gelb', 2),
	(3, 'alt_title', 'T-Shirt Black', 1),
	(3, 'title', 'T-Shirt Black', 1),
	(3, 'alt_title', 'T-Shirt Schwarz', 2),
	(3, 'title', 'T-Shirt Schwarz', 2),
	(4, 'alt_title', 'T-Shirt Red', 1),
	(4, 'title', 'T-Shirt Red', 1),
	(4, 'alt_title', 'T-Shirt Rot', 2),
	(4, 'title', 'T-Shirt Rot', 2),
	(5, 'alt_title', 'Sneaker red', 1),
	(5, 'title', 'Sneaker red', 1),
	(5, 'alt_title', 'Sneaker Rot', 2),
	(5, 'title', 'Sneaker Rot', 2),
	(6, 'alt_title', 'Sneaker Gold', 1),
	(6, 'title', 'Sneaker Gold', 1),
	(6, 'alt_title', 'Sneaker Gold', 2),
	(6, 'title', 'Sneaker Gold', 2),
	(7, 'alt_title', 'Laptop Black', 1),
	(7, 'title', 'Laptop Black', 1),
	(7, 'alt_title', 'Laptop Schwarz', 2),
	(7, 'title', 'Laptop Schwarz', 2),
	(8, 'alt_title', 'Laptop Gold', 1),
	(8, 'title', 'Laptop Gold', 1),
	(8, 'alt_title', 'Laptop Gelb', 2),
	(8, 'title', 'Laptop Gelb', 2);