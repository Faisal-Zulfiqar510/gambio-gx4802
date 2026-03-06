DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
	`languages_id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(32) NOT NULL DEFAULT '',
	`code` char(2) NOT NULL DEFAULT '',
	`image` varchar(255) DEFAULT NULL,
	`directory` varchar(32) DEFAULT NULL,
	`sort_order` int(3) DEFAULT NULL,
	`language_charset` text NOT NULL,
	`date_format` varchar(32) NOT NULL,
	`date_format_long` varchar(32) NOT NULL,
	`date_format_short` varchar(32) NOT NULL,
	`date_time_format` varchar(32) NOT NULL,
	`dob_format_string` varchar(32) NOT NULL,
	`html_params` text NOT NULL,
	`language_currency` varchar(32) NOT NULL,
	`php_date_time_format` varchar(32) NOT NULL,
	`status` tinyint(1) unsigned NOT NULL DEFAULT '0',
	`status_admin` tinyint(1) unsigned NOT NULL DEFAULT '1',
	PRIMARY KEY (`languages_id`),
	KEY `IDX_LANGUAGES_NAME` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

INSERT INTO `languages` (`languages_id`, `name`, `code`, `image`, `directory`, `sort_order`, `language_charset`, `date_format`, `date_format_long`, `date_format_short`, `date_time_format`, `dob_format_string`, `html_params`, `language_currency`, `php_date_time_format`, `status`, `status_admin`) VALUES
	(1, 'English', 'en', 'icon.gif', 'english', 2, 'utf-8', 'm/d/Y', 'l, d. F Y', 'm/d/Y', 'm/d/Y H:i:s', 'mm/dd/yyyy', 'dir="ltr" lang="en"', 'USD', 'm/d/Y H:i:s', 1, 1),
	(2, 'Deutsch', 'de', 'icon.gif', 'german', 1, 'utf-8', 'd.m.Y', 'l, d. F Y', 'd.m.Y', 'd.m.Y H:i:s', 'tt.mm.jjjj', 'dir="ltr" lang="de"', 'EUR', 'd.m.Y H:i:s', 1, 1);
