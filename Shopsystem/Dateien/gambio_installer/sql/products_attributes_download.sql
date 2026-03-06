DROP TABLE IF EXISTS `products_attributes_download`;
CREATE TABLE `products_attributes_download` (
  `products_attributes_id` int(11) NOT NULL DEFAULT '0',
  `products_attributes_filename` varchar(255) NOT NULL DEFAULT '',
  `products_attributes_maxdays` int(2) DEFAULT '0',
  `products_attributes_maxcount` int(2) DEFAULT '0',
  PRIMARY KEY (`products_attributes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `products_attributes_download` VALUES
	(1, 'gambio_handbuch.html', 365, 100),
	(5, 'laptop_anleitung.pdf', 100, 100),
	(6, 'laptop_anleitung.html', 100, 100);