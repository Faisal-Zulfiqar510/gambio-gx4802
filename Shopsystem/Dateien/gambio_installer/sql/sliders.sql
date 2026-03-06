DROP TABLE IF EXISTS `sliders`;
CREATE TABLE IF NOT EXISTS `sliders` (
	`slider_id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL DEFAULT '',
	`speed` decimal(5,3) unsigned NOT NULL DEFAULT 3.000,
	`start_page` tinyint(1) unsigned NOT NULL DEFAULT 0,
	PRIMARY KEY (`slider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `sliders` (`slider_id`, `name`, `speed`, `start_page`)
VALUES
(1, 'Startseite', 3.000, 1);