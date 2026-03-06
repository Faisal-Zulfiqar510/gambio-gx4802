DROP TABLE IF EXISTS `admin_access_roles`;
CREATE TABLE `admin_access_roles` (
	`admin_access_role_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`sort_order` INT(11) UNSIGNED NOT NULL DEFAULT '0',
	`deleting_unknown_group_granted` SMALLINT UNSIGNED NOT NULL DEFAULT '1',
	`reading_unknown_group_granted` SMALLINT UNSIGNED NOT NULL DEFAULT '1',
	`writing_unknown_group_granted` SMALLINT UNSIGNED NOT NULL DEFAULT '1',
	`protected` SMALLINT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`admin_access_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO admin_access_roles (admin_access_role_id, sort_order, deleting_unknown_group_granted, reading_unknown_group_granted, writing_unknown_group_granted, protected) VALUES
(1, 1, 1, 1, 1, 1);