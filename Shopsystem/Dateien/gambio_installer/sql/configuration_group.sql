DROP TABLE IF EXISTS `configuration_group`;
CREATE TABLE `configuration_group` (
	`configuration_group_id` int(11) NOT NULL AUTO_INCREMENT,
	`configuration_group_title` varchar(64) NOT NULL DEFAULT '',
	`configuration_group_description` varchar(255) NOT NULL DEFAULT '',
	`sort_order` int(5) DEFAULT NULL,
	`visible` int(1) DEFAULT '1',
	PRIMARY KEY (`configuration_group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;

INSERT INTO `configuration_group` (`configuration_group_id`, `configuration_group_title`, `configuration_group_description`, `sort_order`, `visible`) VALUES
	(1, 'My Store', 'General information about my store', 1, 1),
	(2, 'Minimum Values', 'The minimum values for functions / data', 2, 1),
	(3, 'Maximum Values', 'The maximum values for functions / data', 3, 1),
	(4, 'Images', 'Image parameters', 4, 1),
	(5, 'Customer Details', 'Customer account configuration', 5, 1),
	(6, 'Module Options', 'Hidden from configuration', 6, 0),
	(7, 'Shipping/Packaging', 'Shipping options available at my store', 7, 1),
	(8, 'Product Listing', 'Product Listing    configuration options', 8, 1),
	(9, 'Stock', 'Stock configuration options', 9, 1),
	(10, 'Logging', 'Logging configuration options', 10, 1),
	(11, 'Cache', 'Caching configuration options', 11, 1),
	(12, 'E-Mail Options', 'General setting for E-Mail transport and HTML E-Mails', 12, 1),
	(13, 'Download', 'Downloadable products options', 13, 1),
	(14, 'GZip Compression', 'GZip compression options', 14, 1),
	(15, 'Sessions', 'Session options', 15, 1),
	(16, 'Meta-Tags/Search engines', 'Meta-tags/Search engines', 16, 1),
	(18, 'Vat ID', 'Vat ID', 18, 1),
	(19, 'Google Conversion', 'Google Conversion-Tracking', 19, 1),
	(20, 'Import/Export', 'Import/Export', 20, 1),
	(21, 'Afterbuy', 'Afterbuy.de', 21, 1),
	(22, 'Search Options', 'Additional Options for search function', 22, 1),
	(25, 'PayPal', 'PayPal', 25, 1),
	(26, 'brickfox', 'brickfox.de', 26, 1),
	(753, 'Gambio-Shop-Key', 'Gambio-Shop-Key', 753, 1),
	(32, 'Skrill', 'Skrill', 32, 1);