DROP TABLE IF EXISTS `quantity_unit_description`;
CREATE TABLE `quantity_unit_description` (
  `quantity_unit_id` int(11) NOT NULL DEFAULT '0',
  `language_id` int(11) NOT NULL DEFAULT '0',
  `unit_name` varchar(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`quantity_unit_id`,`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `quantity_unit_description`
VALUES ('1', '1', 'mg'),
('1', '2', 'mg'),
('2', '1', 'g'),
('2', '2', 'g'),
('3', '1', 'kg'),
('3', '2', 'kg'),
('4', '1', 'ml'),
('4', '2', 'ml'),
('5', '1', 'cl'),
('5', '2', 'cl'),
('6', '1', 'l'),
('6', '2', 'l'),
('7', '1', 'cm'),
('7', '2', 'cm'),
('8', '1', 'm'),
('8', '2', 'm'),
('9', '1', 'sqm'),
('9', '2', 'sqm'),
('10', '1', 'cbm'),
('10', '2', 'cbm'),
('11', '1', 'ct'),
('11', '2', 'ct');
