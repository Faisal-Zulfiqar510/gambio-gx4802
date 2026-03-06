DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
	`name` varchar(64) NOT NULL,
	`path` varchar(200) NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`data` mediumtext NOT NULL,
	`last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`name`,`path`,`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
