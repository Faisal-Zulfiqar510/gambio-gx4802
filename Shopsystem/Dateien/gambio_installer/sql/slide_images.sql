DROP TABLE IF EXISTS `slide_images`;
CREATE TABLE IF NOT EXISTS `slide_images` (
  `slide_image_id` int(11) NOT NULL AUTO_INCREMENT,
  `slide_id` int(11) NOT NULL DEFAULT '0',
  `language_id` int(11) NOT NULL DEFAULT '0',
  `breakpoint` enum('xs','sm','md','lg') NOT NULL DEFAULT 'lg',
  `image` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`slide_image_id`),
  UNIQUE KEY `slide_image_id` (`slide_image_id`,`slide_id`,`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `slide_images` (`slide_image_id`, `slide_id`, `language_id`, `breakpoint`, `image`)
VALUES
(1, 1, 2, 'xs', 'slider-xs.png'),
(2, 1, 2, 'sm', 'slider-sm.png'),
(3, 1, 2, 'md', 'slider-md.png'),
(4, 1, 2, 'lg', 'slider-lg.png'),
(5, 2, 1, 'xs', 'slider-xs.png'),
(6, 2, 1, 'sm', 'slider-sm.png'),
(7, 2, 1, 'md', 'slider-md.png'),
(8, 2, 1, 'lg', 'slider-lg.png'),
(9, 3, 2, 'xs', 'slider-xs.png'),
(10, 3, 2, 'sm', 'slider-sm.png'),
(11, 3, 2, 'md', 'slider-md.png'),
(12, 3, 2, 'lg', 'slider-lg.png'),
(13, 4, 1, 'xs', 'slider-xs.png'),
(14, 4, 1, 'sm', 'slider-sm.png'),
(15, 4, 1, 'md', 'slider-md.png'),
(16, 4, 1, 'lg', 'slider-lg.png');