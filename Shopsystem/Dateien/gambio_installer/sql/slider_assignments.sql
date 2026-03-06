DROP TABLE IF EXISTS `slider_assignments`;
CREATE TABLE `slider_assignments` (
  `slider_id` int(11) NOT NULL DEFAULT '0',
  `entity_id` int(11) NOT NULL DEFAULT '0',
  `entity_type` enum('category','content','product') NOT NULL DEFAULT 'category',
  PRIMARY KEY (`entity_id`,`entity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;