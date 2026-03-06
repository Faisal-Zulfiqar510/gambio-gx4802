DROP TABLE IF EXISTS `products_images`;
CREATE TABLE `products_images` (
	`image_id` int(11) NOT NULL AUTO_INCREMENT,
	`products_id` int(11) NOT NULL DEFAULT '0',
	`image_nr` smallint(6) NOT NULL DEFAULT '0',
	`image_name` varchar(255) NOT NULL DEFAULT '',
	`gm_show_image` int(1) unsigned NOT NULL DEFAULT '1',
	PRIMARY KEY (`image_id`),
	UNIQUE KEY `products_id` (`products_id`,`image_nr`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

INSERT INTO `products_images` (`image_id`, `products_id`, `image_nr`, `image_name`, `gm_show_image`)
VALUES
(62, 1, 1, 'shirt-yellow.png', 1),
(63, 1, 2, 'shirt-red.png', 1),
(64, 1, 3, 'shirt-black.png', 1);