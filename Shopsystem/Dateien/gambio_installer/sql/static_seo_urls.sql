DROP TABLE IF EXISTS `static_seo_urls`;
CREATE TABLE `static_seo_urls` (
	`static_seo_url_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL DEFAULT '',
	`sitemap_entry` int(1) NOT NULL DEFAULT '0',
	`priority` varchar(3) NOT NULL DEFAULT '0.5',
	`changefreq` varchar(255) NOT NULL DEFAULT 'weekly',
	`robots_disallow_entry` int(1) NOT NULL DEFAULT '0',
	`opengraph_image` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`static_seo_url_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `static_seo_urls` (`name`, `sitemap_entry`, `priority`, `changefreq`, `robots_disallow_entry`, `opengraph_image`) VALUES
	('specials.php', 0, '0.5', 'weekly', 0, ''),
	('products_new.php', 0, '0.5', 'weekly', 0, ''),
	('login.php', 0, '0.5', 'weekly', 1, ''),
	('password_double_opt.php', 0, '0.5', 'weekly', 1, ''),
	('wish_list.php', 0, '0.5', 'weekly', 1, ''),
	('shopping_cart.php', 0, '0.5', 'weekly', 1, ''),
	('advanced_search_result.php', 0, '0.5', 'weekly', 1, ''),
	('advanced_search.php', 0, '0.5', 'weekly', 1, ''),
	('newsletter.php', 0, '0.5', 'weekly', 1, ''),
	('index.php', 0, '0.5', 'weekly', 0, '');
