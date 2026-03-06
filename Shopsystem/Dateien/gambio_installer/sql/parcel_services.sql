DROP TABLE IF EXISTS `parcel_services`;
CREATE TABLE `parcel_services`
(
    `parcel_service_id` int(11) NOT NULL AUTO_INCREMENT,
    `name`              varchar(45)  NOT NULL DEFAULT '',
    `default`           tinyint(4) NOT NULL DEFAULT '0',
    `shipment_type`     varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`parcel_service_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `parcel_services` (`parcel_service_id`, `name`, `default`, `shipment_type`)
VALUES (1, 'DHL', 1, ''),
       (2, 'DPD', 0, ''),
       (3, 'GLS', 0, ''),
       (4, 'Hermes', 0, ''),
       (5, 'UPS', 0, ''),
       (6, 'Shipcloud', 0, ''),
       (7, 'FedEx', 0, ''),
       (8, 'MyHermes', 0, ''),
       (9, 'Hermes HSI', 0, '');
