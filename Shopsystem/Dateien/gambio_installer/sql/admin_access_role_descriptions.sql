DROP TABLE IF EXISTS `admin_access_role_descriptions`;
CREATE TABLE `admin_access_role_descriptions` (
	`admin_access_role_id` INT(11) UNSIGNED NOT NULL DEFAULT '1',
	`language_id` int(11) NOT NULL DEFAULT '1',
	`name` varchar(255) NOT NULL DEFAULT '',
	`description` text NOT NULL,
	PRIMARY KEY (`admin_access_role_id`, `language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `admin_access_role_descriptions` (`admin_access_role_id`, `language_id`, `name`, `description`) VALUES
(1, 1, 'Super Administrator', 'Superior administrator role, that has every permission. This role should neither be deleted nor changed.'),
(1, 2, 'Super-Administrator', 'Übergeordnete Administrator-Rolle, die jegliche Berechtigung besitzt. Diese Rolle sollte weder gelöscht noch geändert werden.');