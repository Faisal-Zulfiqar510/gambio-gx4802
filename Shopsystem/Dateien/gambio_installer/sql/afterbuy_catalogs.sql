DROP TABLE IF EXISTS `afterbuy_catalogs`;
CREATE TABLE `afterbuy_catalogs` (
  `catalog_id` int NOT NULL,
  `parent_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `level` int NOT NULL DEFAULT '0',
  `position` int NOT NULL DEFAULT '0',
  `additionaltext` varchar(255) NOT NULL,
  `show_catalog` tinyint(1) NOT NULL DEFAULT '0',
  `picture1` varchar(255) NOT NULL,
  `picture2` varchar(255) NOT NULL,
  `titlepicture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `afterbuy_catalogs`
    ADD PRIMARY KEY (`catalog_id`);

