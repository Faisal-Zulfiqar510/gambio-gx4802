DROP TABLE IF EXISTS `cookie_consent_panel_purposes`;
CREATE TABLE `cookie_consent_panel_purposes` (
	`purpose_id` int(8) NOT NULL AUTO_INCREMENT,
	`language_id` int(8) NOT NULL,
	`category_id` int(8) NOT NULL,
	`purpose_description` TEXT NOT NULL,
	`purpose_name` varchar(128) NOT NULL,
	`purpose_alias` varchar(128),
	`purpose_status` boolean DEFAULT true NOT NULL,
	`purpose_deletable` boolean DEFAULT true NOT NULL,
	PRIMARY KEY (`purpose_id`, `language_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `cookie_consent_panel_purposes` (`purpose_id`, `language_id`, `category_id`, `purpose_description`, `purpose_name`, `purpose_alias`, `purpose_status`, `purpose_deletable`)
    VALUES
        -- Session Cookies
		(1, 1, 1, '', 'Session Cookies', null, 1, 0),
		(1, 2, 1, '', 'Session Cookies', null, 1, 0),
        -- Setting Cookies
        (2, 1, 1, '', 'Setting Cookies', null, 1, 0),
        (2, 2, 1, '', 'Cookie-Einstellungen', null, 1, 0),
	    -- Google Recaptcha
	    (3, 1, 2, '', 'Google Recaptcha', NULL, 0, 0),
	    (3, 2, 2, '', 'Google Recaptcha', NULL, 0, 0),
        -- Google Analytics
        (4, 1, 3, '', 'Google Analytics', null, 0, 0),
        (4, 2, 3, '', 'Google Analytics', null, 0, 0),
        -- Google Maps
        (5, 1, 2, '', 'Google Maps', 'gambio/googleMaps', 0, 0),
        (5, 2, 2, '', 'Google Maps', 'gambio/googleMaps', 0, 0)
;