DROP TABLE IF EXISTS `products_item_codes`;
CREATE TABLE `products_item_codes` (
  `products_id` int(11) NOT NULL DEFAULT '0',
  `code_isbn` varchar(128) DEFAULT NULL,
  `code_upc` varchar(128) DEFAULT NULL,
  `code_mpn` varchar(128) DEFAULT NULL,
  `code_jan` varchar(128) DEFAULT NULL,
  `google_export_condition_id` int(10) unsigned NOT NULL DEFAULT '1',
  `google_export_availability_id` int(10) unsigned NOT NULL DEFAULT '0',
  `brand_name` varchar(128) NOT NULL DEFAULT '',
  `identifier_exists` tinyint(1) NOT NULL DEFAULT '1',
  `gender` enum('','Herren','Damen','Unisex') NOT NULL DEFAULT '',
  `age_group` enum('','Erwachsene','Kinder') NOT NULL DEFAULT '',
  `expiration_date` date NOT NULL DEFAULT '1000-01-01',
  PRIMARY KEY (`products_id`),
  KEY `google_export_condition_id` (`google_export_condition_id`),
  KEY `brand_name` (`brand_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `products_item_codes` (`products_id`, `code_isbn`, `code_upc`, `code_mpn`, `code_jan`, `google_export_condition_id`, `google_export_availability_id`, `brand_name`, `identifier_exists`, `gender`, `age_group`, `expiration_date`)
VALUES
(1, '', '', '', '', 1, 0, '', 0, '', '', '1000-01-01'),
(2, '', '', '', '', 1, 0, '', 0, '', '', '1000-01-01'),
(3, '', '', '', '', 1, 0, '', 0, '', '', '1000-01-01'),
(4, '', '', '', '', 1, 0, '', 0, '', '', '1000-01-01'),
(5, '', '', '', '', 1, 0, '', 0, '', '', '1000-01-01');