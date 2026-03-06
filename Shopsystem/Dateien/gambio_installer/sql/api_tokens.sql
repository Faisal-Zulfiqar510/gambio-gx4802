DROP TABLE IF EXISTS `api_tokens`;
CREATE TABLE `api_tokens` (
	`api_tokens_id` int(11) NOT NULL AUTO_INCREMENT,
	`iss` varchar(255) NOT NULL,
	`exp` int(11) NOT NULL,
	`iat` int(11) NOT NULL,
	`customer_id` int(11) NOT NULL,
	`token` varchar(1000) NOT NULL,
	PRIMARY KEY (`api_tokens_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
