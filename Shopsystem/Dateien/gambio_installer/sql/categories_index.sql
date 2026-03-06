DROP TABLE IF EXISTS `categories_index`;
CREATE TABLE `categories_index` (
  `products_id` int(11) NOT NULL DEFAULT '0',
  `categories_index` text NOT NULL,
  PRIMARY KEY (`products_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `categories_index` (`products_id`, `categories_index`) VALUES
(1, '-0--1-'),
(2, '-0--1-'),
(3, '-0--1-'),
(4, '-0--1-'),
(5, '-0--1-'),
(6, '-0--1-');