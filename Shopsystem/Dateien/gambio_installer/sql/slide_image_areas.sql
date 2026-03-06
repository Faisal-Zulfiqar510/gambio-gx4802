DROP TABLE IF EXISTS `slide_image_areas`;
CREATE TABLE `slide_image_areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slide_images_id` int(11) NOT NULL DEFAULT '0',
  `coordinates` text NOT NULL,
  `link_title` varchar(255) NOT NULL DEFAULT '',
  `link_url` varchar(255) NOT NULL DEFAULT '',
  `link_target` enum('_self','_blank') NOT NULL DEFAULT '_self',
  PRIMARY KEY (`id`),
  KEY `fk_slide_image_maparea_slide_image1` (`slide_images_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;