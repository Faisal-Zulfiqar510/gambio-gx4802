DROP TABLE IF EXISTS `properties_description`;
CREATE TABLE `properties_description` (
	`properties_description_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`properties_id`             int(10) unsigned NOT NULL DEFAULT '0',
	`language_id`               int(10) unsigned NOT NULL DEFAULT '0',
	`properties_name`           varchar(255)     NOT NULL DEFAULT '',
	`properties_admin_name`     varchar(255)     NOT NULL DEFAULT '',
	`description`               varchar(255)     NOT NULL DEFAULT '',
	PRIMARY KEY (`properties_description_id`),
	UNIQUE KEY `unique_description`(`properties_id`, `language_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `properties_description`
VALUES (1, 1, 2, 'Größe', 'Größe', ''),
	(2, 1, 1, 'Size', 'Size', ''),
	(3, 2, 2, 'Farbe', 'Farbe', ''),
	(4, 2, 1, 'Color', 'Color', ''),
	(5, 3, 2, 'als Geschenk verpackt', 'als Geschenk verpackt', ''),
	(6, 3, 1, 'giftwrapped', 'giftwrapped', ''),
	(7, 4, 2, 'Dateiformat', 'Dateiformat', ''),
	(8, 4, 1, 'Fileformat', 'Fileformat', ''),
	(9, 5, 2, 'Größe', 'Schuhgröße', ''),
	(10, 5, 1, 'Size', 'Shoe size', ''),
	(11, 6, 2, 'Garantieverlängerung', 'Garantieverlängerung', ''),
	(12, 6, 1, 'Extended warranty', 'Extended warranty', '');