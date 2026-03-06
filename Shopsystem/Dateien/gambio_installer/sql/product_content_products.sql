DROP TABLE IF EXISTS `product_content_products`;
CREATE TABLE IF NOT EXISTS `product_content_products` (
	`product_content_id` INT NOT NULL,
	`product_id`         INT NOT NULL,
	PRIMARY KEY (`product_id` ASC, `product_content_id` ASC)
)
	ENGINE = InnoDB;