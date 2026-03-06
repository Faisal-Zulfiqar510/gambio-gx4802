DROP TABLE IF EXISTS `product_content_resources`;
CREATE TABLE IF NOT EXISTS `product_content_resources` (
	`product_content_description_id` INT          NOT NULL,
	`product_content_types_id`       INT          NOT NULL,
	`resource`                       VARCHAR(255) NULL,
	PRIMARY KEY (`product_content_description_id`, `product_content_types_id`)
)
	ENGINE = InnoDB;