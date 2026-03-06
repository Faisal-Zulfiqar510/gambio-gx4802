DROP TABLE IF EXISTS `products_description`;
CREATE TABLE `products_description` (
	`products_id` int(11) NOT NULL AUTO_INCREMENT,
	`language_id` int(11) NOT NULL DEFAULT '1',
	`products_name` varchar(255) NOT NULL DEFAULT '',
	`products_description` text,
	`products_short_description` text,
	`products_keywords` varchar(255) DEFAULT NULL,
	`products_meta_title` text NOT NULL,
	`products_meta_description` text NOT NULL,
	`products_meta_keywords` text NOT NULL,
	`products_url` varchar(255) DEFAULT NULL,
	`products_viewed` int(5) DEFAULT '0',
	`gm_alt_text` varchar(255) DEFAULT NULL,
	`gm_url_keywords` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL DEFAULT '',
	`checkout_information` text NOT NULL,
	PRIMARY KEY (`products_id`, `language_id`),
	KEY `products_name` (`products_name`),
	KEY `language_id` (`language_id`,`products_keywords`),
	KEY `language_id_2` (`language_id`,`products_name`),
	KEY `seo_boost_index` (`gm_url_keywords`,`products_id`,`language_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `products_description` (`products_id`, `language_id`, `products_name`, `products_description`, `products_short_description`, `products_keywords`, `products_meta_title`, `products_meta_description`, `products_meta_keywords`, `products_url`, `products_viewed`, `gm_alt_text`, `gm_url_keywords`, `checkout_information`)
VALUES
(1, 1, 'T-Shirt', '<p>\r\n	T-Shirt description\r\n</p>', '<p>\r\n	T-Shirt short description\r\n</p>', '', '', '', '', '', 0, 'product image', 'test-article', ''),
(1, 2, 'T-Shirt', '[TAB:Seite 1] T-Shirt Beschreibung Seite 1 [TAB:Seite 2] T-Shirt Beschreibung Seite 2 [TAB:Seite 3] T-Shirt Beschreibung Seite 3', '<p>\r\n	T-Shirt Kurzbeschreibung\r\n</p>', '', '', '', '', '', 0, 'Artikelbild', 'T-Shirt', ''),
(2, 1, 'Gambio Manual', '<p>\r\n	Everything you need to know about your Gambio Store\r\n</p>', '<p>\r\n	Everything you need to know about your Gambio Store\r\n</p>', '', '', '', '', '', 0, 'manual image', 'manual', ''),
(2, 2, 'Gambio Handbuch', '<p>\r\n	Alles was du über deinen Gambio Shop wissen musst\r\n</p>', '<p>\r\n	Alles was du über deinen Gambio Shop wissen musst\r\n</p>', '', '', '', '', '', 0, 'handbuch image', 'handbuch', ''),
(3, 1, 'Sneaker', '', '', '', '', '', '', '', 0, 'sneaker', 'sneaker', ''),
(3, 2, 'Sneaker', '', '', '', '', '', '', '', 0, 'sneaker', 'sneaker', ''),
(4, 1, 'Laptop', '', '', '', '', '', '', '', 0, 'laptop', 'laptop', ''),
(4, 2, 'Laptop', '', '', '', '', '', '', '', 0, 'laptop', 'laptop', ''),
(5, 1, 'T-Shirt Gambio', '<p>\r\n	T-Shirt description\r\n</p>', '<p>\r\n	T-Shirt short description\r\n</p>', '', '', '', '', '', 0, 'product image', 'test-article', ''),
(5, 2, 'T-Shirt Gambio', '[TAB:Seite 1] T-Shirt Beschreibung Seite 1 [TAB:Seite 2] T-Shirt Beschreibung Seite 2 [TAB:Seite 3] T-Shirt Beschreibung Seite 3', '<p>\r\n	T-Shirt Kurzbeschreibung\r\n</p>', '', '', '', '', '', 0, 'Artikelbild', 'T-Shirt', '');