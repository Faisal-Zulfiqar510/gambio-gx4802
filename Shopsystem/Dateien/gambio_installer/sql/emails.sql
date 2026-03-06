DROP TABLE IF EXISTS `emails`;
CREATE TABLE `emails` (
  `email_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL DEFAULT '',
  `content_plain` text,
  `content_html` longtext,
  `is_pending` tinyint(4) DEFAULT '1',
  `creation_date` datetime NOT NULL DEFAULT '1000-01-01 00:00:00',
  `sent_date` datetime DEFAULT NULL,
  PRIMARY KEY (`email_id`),
  KEY `emails_creation_date_index` (`creation_date`),
  KEY `emails_sent_date_index` (`sent_date`),
  KEY `emails_subject_index` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
