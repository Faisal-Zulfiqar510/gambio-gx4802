DROP TABLE IF EXISTS `afterbuy_products`;
CREATE TABLE `afterbuy_products` (
    `products_id` int NOT NULL,
    `combi_id` int DEFAULT NULL,
    `afterbuy_product_id` int NOT NULL,
    `data_origin` varchar(10) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `afterbuy_products`
    ADD UNIQUE KEY `afterbuy_product_id` (`afterbuy_product_id`),
    ADD UNIQUE KEY `products_id_2` (`products_id`,`combi_id`);
