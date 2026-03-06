DROP TABLE IF EXISTS `mf_claims`;
CREATE TABLE `mf_claims` (
  `orderId` int(10) unsigned NOT NULL DEFAULT '0',
  `fileNumber` int(10) unsigned NOT NULL DEFAULT '0',
  `firstname` varchar(100) NOT NULL DEFAULT '',
  `lastname` varchar(100) NOT NULL DEFAULT '',
  `transmissionDate` int(10) unsigned NOT NULL DEFAULT '0',
  `statusCode` smallint(5) unsigned NOT NULL DEFAULT '0',
  `statusText` text NOT NULL,
  `statusDetails` text NOT NULL,
  `lastChange` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `orderId` (`orderId`,`fileNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;