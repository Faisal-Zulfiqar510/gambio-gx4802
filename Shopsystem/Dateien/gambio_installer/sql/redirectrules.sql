DROP TABLE IF EXISTS `redirectrules`;
CREATE TABLE `redirectrules` (
	`redirect_id` int(11) NOT NULL AUTO_INCREMENT,
	`url_path` varchar(200) NOT NULL,
	`query` varchar(200) NOT NULL,
	`query_match_mode` varchar(12) NOT NULL DEFAULT 'ignore',
	`response_code` int(11) NOT NULL DEFAULT '302',
	`target` varchar(200) NOT NULL,
	`query_processing` varchar(6) NOT NULL DEFAULT 'merge',
	`status` int(1) NOT NULL DEFAULT '1',
	PRIMARY KEY (`redirect_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
