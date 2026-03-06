DROP TABLE IF EXISTS `export_types`;
CREATE TABLE `export_types` (
	`type_id` int(11) unsigned NOT NULL DEFAULT '0',
	`language_id` int(11) unsigned NOT NULL DEFAULT '0',
	`name` varchar(64) NOT NULL DEFAULT '',
	PRIMARY KEY (`type_id`,`language_id`),
	KEY `language_id` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `export_types` (`type_id`, `language_id`, `name`) VALUES
	(1, 1, 'Product export'),
	(1, 2, 'Artikelexport'),
	(2, 1, 'Price comparison'),
	(2, 2, 'Preis-Portal'),
	(3, 1, 'Google Shopping'),
	(3, 2, 'Google Shopping');