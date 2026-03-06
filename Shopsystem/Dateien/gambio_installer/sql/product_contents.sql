DROP TABLE IF EXISTS `product_contents`;
CREATE TABLE IF NOT EXISTS `product_contents` (
	`id`   INT         NOT NULL         AUTO_INCREMENT,
	`name` VARCHAR(64) NOT NULL,
	PRIMARY KEY (`id`)
)
	ENGINE = InnoDB;