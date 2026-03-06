DROP TABLE IF EXISTS `products_vpe`;
CREATE TABLE `products_vpe` (
  `products_vpe_id` int(11) NOT NULL DEFAULT '0',
  `language_id` int(11) NOT NULL DEFAULT '0',
  `products_vpe_name` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`products_vpe_id`,`language_id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `products_vpe`
VALUES ('1', '1', 'kg'),
('1', '2', 'kg'),
('2', '1', 'g'),
('2', '2', 'g'),
('3', '1', 'mg'),
('3', '2', 'mg'),
('4', '1', 'ml'),
('4', '2', 'ml'),
('5', '1', 'cl'),
('5', '2', 'cl'),
('6', '1', 'l'),
('6', '2', 'l'),
('7', '1', 'cm'),
('7', '2', 'cm'),
('8', '1', 'm'),
('8', '2', 'm'),
('9', '1', 'sqm'),
('9', '2', 'sqm'),
('10', '1', 'cbm'),
('10', '2', 'cbm'),
('11', '1', 'ct'),
('11', '2', 'ct');
