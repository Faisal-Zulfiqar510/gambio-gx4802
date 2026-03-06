DROP TABLE IF EXISTS `cm_file_flags`;
CREATE TABLE `cm_file_flags` (
	`file_flag` int(11) NOT NULL DEFAULT '0',
	`file_flag_name` varchar(32) NOT NULL DEFAULT '',
	PRIMARY KEY (`file_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `cm_file_flags` (`file_flag`, `file_flag_name`) VALUES
	(0, 'information'),
	(1, 'content'),
	(2, 'topmenu_corner'),
	(3, 'topmenu'),
	(4, 'extraboxes'),
	(5, 'withdrawal'),
    (6, 'additional_pages');