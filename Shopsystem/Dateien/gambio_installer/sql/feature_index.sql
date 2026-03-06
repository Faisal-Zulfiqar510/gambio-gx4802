DROP TABLE IF EXISTS `feature_index`;
CREATE TABLE `feature_index` (
  `feature_set_id` int(11) unsigned NOT NULL DEFAULT '0',
  `date_created` datetime DEFAULT NULL,
  `feature_value_index` text,
  PRIMARY KEY (`feature_set_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;