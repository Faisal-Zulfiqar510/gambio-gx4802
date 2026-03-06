DROP TABLE IF EXISTS `products_to_categories`;
CREATE TABLE `products_to_categories` (
	`products_id` int(11) NOT NULL DEFAULT '0',
	`categories_id` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`products_id`,`categories_id`),
	KEY `categories_id` (`categories_id`,`products_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `products_to_categories` (`products_id`, `categories_id`)
VALUES
(1, 1),
(2, 0),
(2, 1),
(3, 0),
(3, 1),
(4, 1),
(5, 0),
(5, 1);