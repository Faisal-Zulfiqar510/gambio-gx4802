DROP TABLE IF EXISTS `admin_access_users`;
CREATE TABLE `admin_access_users` (
	`customer_id` INT(11) NOT NULL DEFAULT '0',
	`admin_access_role_id` INT(11) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`admin_access_role_id`, `customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;