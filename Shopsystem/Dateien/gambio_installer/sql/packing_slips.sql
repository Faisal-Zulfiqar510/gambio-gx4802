DROP TABLE IF EXISTS `packing_slips`;
CREATE TABLE IF NOT EXISTS `packing_slips` (
  `packing_slip_id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) NOT NULL DEFAULT '',
  `date` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  `filename` varchar(255) NOT NULL DEFAULT '',
  `order_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`packing_slip_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;