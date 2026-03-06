DROP TABLE IF EXISTS `afterbuy_catalogs_to_categories`;
CREATE TABLE `afterbuy_catalogs_to_categories` (
  `catalog_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `afterbuy_catalogs_to_categories`
  ADD PRIMARY KEY (`catalog_id`,`category_id`);
