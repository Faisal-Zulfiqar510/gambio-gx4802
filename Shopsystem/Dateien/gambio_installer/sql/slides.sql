DROP TABLE IF EXISTS `slides`;
CREATE TABLE IF NOT EXISTS `slides` (
  `slide_id` int(11) NOT NULL AUTO_INCREMENT,
  `language_id` int(11) NOT NULL NOT NULL DEFAULT '0',
  `slider_id` int(10) unsigned NOT NULL DEFAULT '0',
  `thumbnail` varchar(255) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '',
  `alt_text` varchar(255) NOT NULL DEFAULT '',
  `url` text NOT NULL,
  `url_target` varchar(16) NOT NULL DEFAULT '_self',
  `sort_order` int(3) NOT NULL DEFAULT '0',
  PRIMARY KEY (`slide_id`,`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `slides` (`slide_id`, `language_id`, `slider_id`, `thumbnail`, `title`, `alt_text`, `url`, `url_target`, `sort_order`)
VALUES
(1, 2, 1, '', 'Slide 1', 'Slide 1 - Alternativtext', '', '_blank', 2),
(2, 1, 1, '', 'Slide 1', 'Slide 1 - Alternative Text', '', '_blank', 2),
(3, 2, 1, '', 'Slide 2', 'Slide 2 - Alternativtext', '', '_blank', 1),
(4, 1, 1, '', 'Slide 2', 'Slide 2 - Alternative Text', '', '_blank', 1);