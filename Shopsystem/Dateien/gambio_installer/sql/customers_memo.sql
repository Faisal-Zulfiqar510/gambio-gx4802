DROP TABLE IF EXISTS `customers_memo`;
CREATE TABLE `customers_memo` (
  `memo_id` int(11) NOT NULL AUTO_INCREMENT,
  `customers_id` int(11) NOT NULL DEFAULT '0',
  `memo_date` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  `last_modified` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `memo_text` text NOT NULL,
  `poster_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`memo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;