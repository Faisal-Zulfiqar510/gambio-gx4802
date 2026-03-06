DROP TABLE IF EXISTS `afterbuy_orders`;
CREATE TABLE `afterbuy_orders`
(
    `id`                INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id`          INT      NOT NULL,
    `afterbuy_order_id` INT      NOT NULL,
    `state`             ENUM ('unprocessed', 'transmitted', 'paid') DEFAULT 'unprocessed',
    `created_at`        DATETIME NOT NULL                           DEFAULT NOW(),
    `modified_at`       DATETIME NOT NULL ON UPDATE NOW()           DEFAULT NOW(),
    UNIQUE KEY `orders_mapping` (`order_id`, `afterbuy_order_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;