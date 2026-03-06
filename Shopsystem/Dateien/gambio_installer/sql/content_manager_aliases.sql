DROP TABLE IF EXISTS `content_manager_aliases`;

CREATE TABLE `content_manager_aliases` (
	`content_group` INT(16)      NOT NULL,
	`content_alias` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`content_group`)
)
	ENGINE = InnoDB;

INSERT INTO `content_manager_aliases` (`content_group`, `content_alias`)
VALUES ('4321008', 'Malibu-below-slider'),
	('4321009', 'Footer-column-1'),
	('4321005', 'Footer-column-2'),
	('4321006', 'Footer-column-3'),
	('4321007', 'Footer-column-4');