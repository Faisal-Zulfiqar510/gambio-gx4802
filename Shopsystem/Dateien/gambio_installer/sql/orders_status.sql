DROP TABLE IF EXISTS `orders_status`;
CREATE TABLE `orders_status` (
	`orders_status_id` int(11) NOT NULL DEFAULT '0',
	`language_id` int(11) NOT NULL DEFAULT '1',
	`orders_status_name` varchar(32) NOT NULL DEFAULT '',
	`color` char(6) NOT NULL DEFAULT '2196F3',
	PRIMARY KEY (`orders_status_id`,`language_id`),
	KEY `idx_orders_status_name` (`orders_status_name`),
    KEY `language_id_index` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `orders_status` (`orders_status_id`, `language_id`, `orders_status_name`, `color`) VALUES
	(0, 1, 'Not validated', 'e0412c'),
	(0, 2, 'Nicht bestätigt', 'e0412c'),
	(1, 1, 'Pending', 'f5ae49'),
	(1, 2, 'Offen', 'f5ae49'),
	(2, 1, 'Processing', '0c7fda'),
	(2, 2, 'In Bearbeitung', '0c7fda'),
	(3, 1, 'Dispatched', '45a845'),
	(3, 2, 'Versendet', '45a845'),
	(99, 1, 'Canceled', 'e0412c'),
	(99, 2, 'Storniert', 'e0412c'),
	(149, 2, 'Rechnung erstellt', '45a845'),
	(149, 1, 'Invoice created', '45a845');
