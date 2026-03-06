DROP TABLE IF EXISTS `coupon_gv_redeem_track`;
CREATE TABLE `coupon_gv_redeem_track` (
	`coupon_gv_redeem_track_id` int(11) NOT NULL AUTO_INCREMENT,
	`orders_id` int(11) NOT NULL,
	`coupon_code` varchar(32) NOT NULL,
	`amount` decimal(10,4) NOT NULL,
	PRIMARY KEY (`coupon_gv_redeem_track_id`),
	KEY `orders_idx` (`orders_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
