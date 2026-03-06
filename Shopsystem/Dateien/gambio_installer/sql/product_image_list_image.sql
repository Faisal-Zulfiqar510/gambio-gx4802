DROP TABLE IF EXISTS `product_image_list_image`;
CREATE TABLE `product_image_list_image` (
	`product_image_list_image_id`         int(11)      NOT NULL AUTO_INCREMENT,
	`product_image_list_id`               int(11)      NOT NULL,
	`product_image_list_image_local_path` TEXT         NOT NULL,
	`product_image_list_image_sort_order` int(8)       NOT NULL DEFAULT '0',
	PRIMARY KEY (`product_image_list_image_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `product_image_list_image`
VALUES (1, 1, 'shirt-yellow.png', 0),
	(3, 3, 'shirt-black.png', 0),
	(4, 2, 'shirt-red.png', 0),
	(5, 4, 'sneaker-swag-red.jpg', 1),
	(6, 5, 'sneaker-swag-yellow.jpg', 2),
    (7, 6, 'laptop-black.jpg', 1),
	(8, 7, 'laptop-yellow.jpg', 2);