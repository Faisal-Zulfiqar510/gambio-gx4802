DROP TABLE IF EXISTS `product_content_types`;
CREATE TABLE IF NOT EXISTS `product_content_types` (
	`id`   INT         NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(64) NULL,
	PRIMARY KEY (`id`)
)
	ENGINE = InnoDB;

INSERT INTO `product_content_types` (`name`) VALUE
	('file'),
	('link'),
	('text');