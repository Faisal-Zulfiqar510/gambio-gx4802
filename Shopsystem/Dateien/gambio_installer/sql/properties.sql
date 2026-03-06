DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
	`properties_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`sort_order`    int(10)          NOT NULL DEFAULT '0',
	`display_type`  VARCHAR(64)      NOT NULL DEFAULT 'Dropdown',
	PRIMARY KEY (`properties_id`),
	KEY `properties_id`(`properties_id`, `sort_order`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `properties` (`properties_id`, `sort_order`, `display_type`)
VALUES (1, 1, 'Dropdown'),
	(2, 2, 'Image'),
	(3, 3, 'Text'),
	(4, 4, 'Radio'),
	(5, 5, 'BoxedText'),
	(6, 6, 'Dropdown');