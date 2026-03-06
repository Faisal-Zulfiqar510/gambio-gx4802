DROP TABLE IF EXISTS `log_levels`;
CREATE TABLE `log_levels` (
	`log_level_id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`log_level_id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `log_levels` (`log_level_id`, `name`) VALUES
	(1, 'error'),
	(2, 'warning'),
	(3, 'notice');