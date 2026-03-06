DROP TABLE IF EXISTS `log_outputs`;
CREATE TABLE `log_outputs` (
	`log_output_id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`log_output_id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `log_outputs` (`log_output_id`, `name`) VALUES
	(1, 'output'),
	(2, 'filepath'),
	(3, 'backtrace'),
	(4, 'request_data'),
	(5, 'code_snippet'),
	(6, 'class_data'),
	(7, 'function_data'),
	(8, 'session_data');