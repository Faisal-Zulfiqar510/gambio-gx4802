DROP TABLE IF EXISTS `admin_access_permissions`;
CREATE TABLE `admin_access_permissions` (
	`admin_access_role_id` INT(11) UNSIGNED NOT NULL,
	`admin_access_group_id` INT(11) UNSIGNED NOT NULL,
	`reading_granted` SMALLINT UNSIGNED NOT NULL DEFAULT '0',
	`writing_granted` SMALLINT UNSIGNED NOT NULL DEFAULT '0',
	`deleting_granted` SMALLINT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`admin_access_group_id`, `admin_access_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `admin_access_permissions` (SELECT 1, `admin_access_group_id`, 1, 1, 1 FROM `admin_access_groups`);
