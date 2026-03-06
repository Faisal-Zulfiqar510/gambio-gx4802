DROP TABLE IF EXISTS `products_properties_admin_select`;
CREATE TABLE `products_properties_admin_select`
(
    `products_properties_admin_select_id` int(11) NOT NULL AUTO_INCREMENT,
    `products_id`                         int(11) NOT NULL DEFAULT '0',
    `properties_id`                       int(11) NOT NULL DEFAULT '0',
    `properties_values_id`                int(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (`products_properties_admin_select_id`),
    UNIQUE KEY `unique_value_assignment` (`products_id`,`properties_values_id`),
    KEY                                   `products_id` (`products_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `products_properties_admin_select` (`products_id`, `properties_values_id`, `properties_id`)
VALUES (1, 1, 1),
       (1, 2, 1),
       (1, 3, 1),
       (1, 4, 2),
       (1, 5, 2),
       (1, 6, 2),
       (3, 4, 2),
       (3, 5, 2),
       (3, 11, 5),
       (3, 12, 5),
       (3, 13, 5),
       (3, 14, 5),
       (3, 15, 5),
       (3, 16, 5),
       (3, 17, 5),
       (3, 18, 5),
       (3, 19, 5),
       (3, 20, 5),
       (3, 21, 5),
       (4, 4, 1),
       (4, 6, 1),
       (5, 1, 1),
       (5, 2, 1),
       (5, 3, 1);
