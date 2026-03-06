DROP TABLE IF EXISTS `static_seo_url_contents`;
CREATE TABLE `static_seo_url_contents` (
  `static_seo_url_content_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `static_seo_url_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL DEFAULT '0',
  `description` text NOT NULL,
  `keywords` text NOT NULL,
  PRIMARY KEY (`static_seo_url_content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;