DROP TABLE IF EXISTS `gm_prd_img_alt`;
CREATE TABLE `gm_prd_img_alt` (
	`img_alt_id` int(11) NOT NULL AUTO_INCREMENT,
	`image_id` int(11) NOT NULL DEFAULT '0',
	`products_id` int(11) NOT NULL DEFAULT '0',
	`language_id` int(11) NOT NULL DEFAULT '1',
	`gm_alt_text` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`img_alt_id`),
	UNIQUE KEY `image_id` (`image_id`,`products_id`,`language_id`),
	KEY `image_id2` (`image_id`,`language_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

INSERT INTO `gm_prd_img_alt` (`img_alt_id`, `image_id`, `products_id`, `language_id`, `gm_alt_text`) VALUES
	(8, 5, 1, 2, 'Artikelbild'),
	(7, 5, 1, 1, 'product image'),
	(11, 7, 1, 1, 'product image'),
	(10, 6, 1, 2, 'Artikelbild'),
	(9, 6, 1, 1, 'product image'),
	(12, 7, 1, 2, 'Artikelbild');