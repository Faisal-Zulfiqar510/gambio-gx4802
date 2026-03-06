DROP TABLE IF EXISTS `gm_counter_info_type`;
CREATE TABLE `gm_counter_info_type` (
	`gm_counter_info_type_id` int(10) NOT NULL AUTO_INCREMENT,
	`gm_counter_info_type_name` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`gm_counter_info_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

INSERT INTO `gm_counter_info_type` (`gm_counter_info_type_id`, `gm_counter_info_type_name`) VALUES
	(1, 'browser'),
	(2, 'platform'),
	(3, 'resolution'),
	(4, 'color_depth'),
	(5, 'origin');