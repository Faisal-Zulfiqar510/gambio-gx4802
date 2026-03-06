DROP TABLE IF EXISTS `delete_history`;
CREATE TABLE `delete_history` (
	`id` int(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`scope` varchar(255) NOT NULL,
	`deleted_id` varchar(255),
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDb DEFAULT CHARSET = `utf8`;