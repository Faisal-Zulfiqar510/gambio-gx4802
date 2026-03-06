DROP TABLE IF EXISTS `product_content_customer_status`;
CREATE TABLE IF NOT EXISTS `product_content_customer_status` (
	`product_content_id` INT NOT NULL,
	`customer_status_id` INT NOT NULL,
	PRIMARY KEY (`product_content_id` ASC, `customer_status_id` ASC)
)
	ENGINE = InnoDB;