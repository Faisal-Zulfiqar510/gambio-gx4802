DROP TABLE IF EXISTS `orders_products_to_coupons`;
CREATE TABLE `orders_products_to_coupons` (
	`orders_products_id` int(11) NOT NULL,
	`coupon_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=`utf8`;
ALTER TABLE `orders_products_to_coupons` ADD UNIQUE KEY `orders_products_id` (`orders_products_id`,`coupon_id`);
