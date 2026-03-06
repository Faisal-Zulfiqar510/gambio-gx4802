DROP TABLE IF EXISTS `product_content_descriptions`;
CREATE TABLE IF NOT EXISTS `product_content_descriptions` (
	`id`                 INT         NOT NULL AUTO_INCREMENT,
	`product_content_id` INT         NOT NULL,
	`language_id`        INT         NOT NULL,
	`title`              VARCHAR(64) NULL,
	`content`            TEXT        NULL,
	`hits`               INT         NOT NULL         DEFAULT 0,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `product_content_id_language_id` (`product_content_id`, `language_id`)
)
	ENGINE = InnoDB;