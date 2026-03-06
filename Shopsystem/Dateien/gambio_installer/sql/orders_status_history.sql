DROP TABLE IF EXISTS `orders_status_history`;
CREATE TABLE `orders_status_history` (
  `orders_status_history_id` int(11) NOT NULL AUTO_INCREMENT,
  `orders_id` int(11) NOT NULL DEFAULT '0',
  `orders_status_id` int(5) NOT NULL DEFAULT '0',
  `date_added` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  `customer_notified` int(1) DEFAULT '0',
  `comments` text,
  `customer_id` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`orders_status_history_id`),
  KEY `orders_id` (`orders_id`),
  KEY `orders_status_id` (`orders_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;