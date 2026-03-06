DROP TABLE IF EXISTS `protectedshops`;
CREATE TABLE `protectedshops` (
  `ps_id` int(11) NOT NULL AUTO_INCREMENT,
  `document_name` varchar(255) NOT NULL DEFAULT '',
  `document_date` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  `md5` varchar(32) NOT NULL DEFAULT '',
  `document_type` varchar(32) NOT NULL DEFAULT '',
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`ps_id`),
  KEY `document_name` (`document_name`,`document_date`,`document_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;