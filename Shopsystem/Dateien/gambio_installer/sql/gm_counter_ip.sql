DROP TABLE IF EXISTS `gm_counter_ip`;
CREATE TABLE `gm_counter_ip` (
  `gm_ip_id` int(10) NOT NULL AUTO_INCREMENT,
  `gm_ip_value` varchar(255) DEFAULT NULL,
  `gm_ip_date` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  `session_hash` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`gm_ip_id`),
  KEY `gm_ip_date` (`gm_ip_date`),
  KEY `gm_ip_value` (`gm_ip_value`),
  KEY `session_hash` (`session_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;