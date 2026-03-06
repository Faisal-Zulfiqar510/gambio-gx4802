DROP TABLE IF EXISTS `afterbuy_products_to_catalogs`;
CREATE TABLE `afterbuy_products_to_catalogs` (
    `catalog_id` int NOT NULL,
    `product_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `afterbuy_products_to_catalogs`
    ADD KEY `catalog_id` (`catalog_id`,`product_id`);
