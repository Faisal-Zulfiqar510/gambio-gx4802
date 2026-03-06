DROP TABLE IF EXISTS `log_groups`;
CREATE TABLE `log_groups` (
	`log_group_id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`log_group_id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `log_groups` (`log_group_id`, `name`) VALUES
	(1, 'error_handler'),
	(2, 'security'),
	(3, 'payment'),
	(4, 'shipping'),
	(5, 'widgets'),
	(6, 'hub');