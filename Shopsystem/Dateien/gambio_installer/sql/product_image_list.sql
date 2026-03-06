DROP TABLE IF EXISTS `product_image_list`;
CREATE TABLE `product_image_list` (
	`product_image_list_id`   int(11)      NOT NULL AUTO_INCREMENT,
	`product_image_list_name` varchar(255) NOT NULL,
	PRIMARY KEY (`product_image_list_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `product_image_list`
VALUE
	(1, 'Gelb / Yellow'),
	(2, 'Rot / Red'),
	(3, 'Schwarz / Black'),
	(4, 'Sneaker Rot / Red'),
	(5, 'Sneaker Gelb / Yellow'),
    (6, 'Laptop Schwarz / Black'),
	(7, 'Laptop Gelb / Yellow');
