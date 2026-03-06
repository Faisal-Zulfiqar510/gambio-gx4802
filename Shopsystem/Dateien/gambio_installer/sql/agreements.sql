DROP TABLE IF EXISTS `agreements`;
CREATE TABLE `agreements` (
  `agreements_id` int(11) NOT NULL AUTO_INCREMENT,
  `customers_name` varchar(128) NOT NULL DEFAULT '',
  `customers_email` varchar(128) NOT NULL DEFAULT '',
  `language_id` int(11) NOT NULL ,
  `ip_address` varchar(16) NOT NULL DEFAULT '',
  `text` text NOT NULL,
  `legal_text_version` varchar(255) NOT NULL DEFAULT '',
  `content_group` int(11) NOT NULL ,
  `date_added` datetime DEFAULT NULL,
  `last_modified` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`agreements_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
