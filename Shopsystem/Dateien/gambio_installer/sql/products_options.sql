DROP TABLE IF EXISTS `products_options`;
CREATE TABLE `products_options` (
	`products_options_id`          int(11)      NOT NULL DEFAULT '0',
	`language_id`                  int(11)      NOT NULL DEFAULT '1',
	`options_id`                   INT          NULL     DEFAULT NULL COMMENT 'mirrors `properties`.`properties_id`',
	`products_options_name`        varchar(255) NOT NULL DEFAULT '',
	`products_option_display_type` varchar(64)  NOT NULL DEFAULT 'Dropdown',
	`admin_label`                  varchar(255) NOT NULL DEFAULT '' COMMENT 'mirrors `properties_description`.`properties_admin_name`',
	`description`                  varchar(255) NOT NULL DEFAULT '' COMMENT 'mirrors `properties_description`.`description`',
	`sort_order`                   int(10)      NULL     DEFAULT NULL COMMENT 'mirrors `properties`.`sort_order`',
	PRIMARY KEY (`products_options_id`, `language_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `products_options`
VALUES
	(1, 1, 1, 'Size', 'Dropdown', 'Size', '', 1),
	(1, 2, 1, 'Größe', 'Dropdown', 'Größe', '', 1),
	(2, 1, 2, 'Color', 'Image', 'Color', '', 1),
	(2, 2, 2, 'Farbe', 'Image', 'Farbe', '', 1),
	(3, 1, 3, 'giftwrapped', 'Text', 'giftwrapped', '', 1),
	(3, 2, 3, 'als Geschenk verpackt', 'Text', 'als Geschenk verpackt', '', 1),
	(4, 1, 4, 'Fileformat', 'Radio', 'Fileformat', '', 4),
	(4, 2, 4, 'Dateiformat', 'Radio', 'Dateiformat', '', 4),
	(5, 1, 5, 'Size', 'BoxedText', 'Shoe size', '', 5),
	(5, 2, 5, 'Größe', 'BoxedText', 'Schuhgröße', '', 5),
	(6, 1, 6, 'Extended warranty', 'Dropdown', 'Extended warranty', '', 6),
	(6, 2, 6, 'Garantieverlängerung', 'Dropdown', 'Garantieverlängerung', '', 6);