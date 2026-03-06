DROP TABLE IF EXISTS `google_export_condition`;

CREATE TABLE `google_export_condition`
(
    `google_export_condition_id` INT(10) AUTO_INCREMENT,
    `language_id`                INT                  DEFAULT 2 NOT NULL,
    `condition`                  varchar(64) NOT NULL DEFAULT '',
    PRIMARY KEY (`google_export_condition_id`, `language_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = `utf8`;

INSERT INTO `google_export_condition` (`google_export_condition_id`, `language_id`, `condition`)
VALUES (1, 2, 'neu'),
       (2, 2, 'gebraucht'),
       (3, 2, 'erneuert'),
       (1, 1, 'new'),
       (2, 1, 'used'),
       (3, 1, 'renewed');