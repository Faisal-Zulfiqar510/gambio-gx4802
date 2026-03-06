DROP TABLE IF EXISTS `coupon_gv_customer`;
CREATE TABLE `coupon_gv_customer` (
  `customer_id` int(5) NOT NULL DEFAULT '0',
  `amount` decimal(13,4) NOT NULL DEFAULT '0.0000',
  PRIMARY KEY (`customer_id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;