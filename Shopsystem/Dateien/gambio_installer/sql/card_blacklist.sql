DROP TABLE IF EXISTS `card_blacklist`;
CREATE TABLE `card_blacklist` (
  `blacklist_id` int(5) NOT NULL AUTO_INCREMENT,
  `blacklist_card_number` varchar(20) NOT NULL DEFAULT '',
  `date_added` datetime DEFAULT NULL,
  `last_modified` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `blacklist_id` (`blacklist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;