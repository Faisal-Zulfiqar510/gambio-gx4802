DROP TABLE IF EXISTS `payment_ipayment_log`;
CREATE TABLE `payment_ipayment_log` (
  `ip_LOG_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ip_LOG_MESSAGE` varchar(255) NOT NULL DEFAULT '',
  `ip_LOG_INFO` text NOT NULL,
  `ip_LOG_DATE` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  PRIMARY KEY (`ip_LOG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;