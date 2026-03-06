DROP TABLE IF EXISTS `product_image_list_attribute`;
CREATE TABLE `product_image_list_attribute` (
	`products_attributes_id` int(11) NOT NULL,
	`product_image_list_id` int(11) NOT NULL,
	PRIMARY KEY (`products_attributes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;