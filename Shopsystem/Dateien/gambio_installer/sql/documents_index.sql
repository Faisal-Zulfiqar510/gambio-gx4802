DROP TABLE IF EXISTS `documents_index`;
CREATE TABLE IF NOT EXISTS `documents_index` (
  `number` int(11) NOT NULL DEFAULT '0',
  `type` enum('invoice','packing_slip') NOT NULL DEFAULT 'invoice',
  `identifier` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`number`,`type`),
  KEY `identifier` (`identifier`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;