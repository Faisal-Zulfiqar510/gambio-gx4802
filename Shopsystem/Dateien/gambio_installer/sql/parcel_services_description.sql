DROP TABLE IF EXISTS `parcel_services_description`;
CREATE TABLE `parcel_services_description` (
	`parcel_service_id` int(11) NOT NULL DEFAULT '0',
	`language_id` int(11) NOT NULL DEFAULT '0',
	`url` varchar(1023) NOT NULL DEFAULT '',
	`comment` text NOT NULL,
	PRIMARY KEY (`parcel_service_id`,`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `parcel_services_description` (`parcel_service_id`, `language_id`, `url`, `comment`) VALUES
	(1, 1, 'http://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang=en&idc={TRACKING_NUMBER}&rfn=&extendedSearch=true', 'You can access the shipment tracking for your order by visiting the link above.'),
	(1, 2, 'http://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang=de&idc={TRACKING_NUMBER}&rfn=&extendedSearch=true', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(2, 1, 'https://tracking.dpd.de/parcelstatus?query={TRACKING_NUMBER}&locale=en_DE', 'You can access the shipment tracking for your order by visiting the link above.'),
	(2, 2, 'https://tracking.dpd.de/parcelstatus?query={TRACKING_NUMBER}&locale=de_DE', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(3, 1, 'https://gls-group.eu/DE/en/parcel-tracking?match={TRACKING_NUMBER}', 'You can access the shipment tracking for your order by visiting the link above.'),
	(3, 2, 'https://gls-group.eu/DE/de/paketverfolgung?match={TRACKING_NUMBER}', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(4, 1, 'https://tracking.hermesworld.com/?TrackID={TRACKING_NUMBER}', 'You can access the shipment tracking for your order by visiting the link above.'),
	(4, 2, 'https://tracking.hermesworld.com/?TrackID={TRACKING_NUMBER}', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(5, 1, 'https://www.ups.com/track?loc=en_EN&tracknum={TRACKING_NUMBER}', 'You can access the shipment tracking for your order by visiting the link above.'),
	(5, 2, 'https://www.ups.com/track?loc=de_DE&tracknum={TRACKING_NUMBER}', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(6, 1, 'https://shipcloud.io', 'You can access the shipment tracking for your order by visiting the link above.'),
	(6, 2, 'https://shipcloud.io', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(7, 1, 'https://www.fedex.com/apps/fedextrack/?action=track&cntry_code=en&trackingnumber={TRACKING_NUMBER}', 'You can access the shipment tracking for your order by visiting the link above.'),
	(7, 2, 'https://www.fedex.com/apps/fedextrack/?action=track&cntry_code=de&trackingnumber={TRACKING_NUMBER}', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(8, 1, 'https://www.myhermes.de/wps/portal/paket/SISYR?auftragsNummer={TRACKING_NUMBER}', 'You can access the shipment tracking for your order by visiting the link above.'),
	(8, 2, 'https://www.myhermes.de/wps/portal/paket/SISYR?auftragsNummer={TRACKING_NUMBER}', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.'),
	(9, 1, 'https://www.myhermes.de/empfangen/sendungsverfolgung/suchen/sendungsinformation#{TRACKING_NUMBER}', 'You can access the shipment tracking for your order by visiting the link above.'),
	(9, 2, 'https://www.myhermes.de/empfangen/sendungsverfolgung/suchen/sendungsinformation#{TRACKING_NUMBER}', 'Die Sendungsverfolgung für Ihre Bestellung können Sie über den oben stehenden Link aufrufen.');
