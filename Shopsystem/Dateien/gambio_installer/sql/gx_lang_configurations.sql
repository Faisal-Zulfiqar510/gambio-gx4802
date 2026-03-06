DROP TABLE IF EXISTS `gx_lang_configurations`;

CREATE TABLE IF NOT EXISTS `gx_lang_configurations` (
	`id`            int          NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`key`           varchar(255) NOT NULL,
	`language_id`   int          NOT NULL,
	`value`         mediumtext,
	`default`       mediumtext,
	`sort_order`    int               DEFAULT NULL,
	`last_modified` timestamp    NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE INDEX `key_language_id`(`key`, `language_id`)
)
	ENGINE = InnoDB
	DEFAULT CHARSET = `utf8`;

INSERT INTO `gx_lang_configurations` (`key`, `language_id`, `value`, `default`, `sort_order`) VALUES
('gm_configuration/EMAIL_BILLING_SUBJECT_ORDER', 1, 'Your order {$nr}, {$date}', 'Your order {$nr}, {$date}', 38),
('gm_configuration/EMAIL_BILLING_SUBJECT_ORDER', 2, 'Ihre Bestellung {$nr}, am {$date}', 'Ihre Bestellung {$nr}, am {$date}', 38),
('gm_configuration/GM_PDF_COMPANY_ADRESS_LEFT', 1, 'Your name, your street 1, 12345 your city', 'Dein Name, deine Straße 1, 12345 dein Ort', NULL),
('gm_configuration/GM_PDF_COMPANY_ADRESS_LEFT', 2, 'dein Name, deine Straße 1, 12345 dein Ort', 'Dein Name, deine Straße 1, 12345 dein Ort', NULL),
('gm_configuration/GM_PDF_COMPANY_ADRESS_RIGHT', 1, 'your name \nyour street 1 \n\n12345 your city', 'your name \nyour street 1 \n\n12345 your city', NULL),
('gm_configuration/GM_PDF_COMPANY_ADRESS_RIGHT', 2, 'dein Name \ndeine Straße 1 \n\n12345 dein Ort', 'dein Name \ndeine Straße 1 \n\n12345 dein Ort', NULL),
('gm_configuration/GM_PDF_CONDITIONS', 1, 'Here could be your terms and conditions.', 'Here could be your terms and conditions.', NULL),
('gm_configuration/GM_PDF_CONDITIONS', 2, 'Hier könnten deine AGB stehen.', 'Hier könnten deine AGB stehen.', NULL),
('gm_configuration/GM_PDF_EMAIL_SUBJECT', 1, 'Your invoice no. {INVOICE_ID} of your order no. {ORDER_ID} from {DATE}', 'Your invoice no. {INVOICE_ID} of your order no. {ORDER_ID} from {DATE}', NULL),
('gm_configuration/GM_PDF_EMAIL_SUBJECT', 2, 'Ihre Rechnung Nr. {INVOICE_ID} zur Bestellung Nr. {ORDER_ID} vom {DATE}', 'Ihre Rechnung Nr. {INVOICE_ID} zur Bestellung Nr. {ORDER_ID} vom {DATE}', NULL),
('gm_configuration/GM_PDF_INVOICES_EMAIL_SUBJECT', 1, 'Your invoices of your order no. {ORDER_ID} from {DATE}', 'Your invoices of your order no. {ORDER_ID} from {DATE}', NULL),
('gm_configuration/GM_PDF_INVOICES_EMAIL_SUBJECT', 2, 'Ihre Rechnungen zur Bestellung Nr. {ORDER_ID} vom {DATE}', 'Ihre Rechnungen zur Bestellung Nr. {ORDER_ID} vom {DATE}', NULL),
('gm_configuration/GM_PDF_SALUTATION_MALE', 1, 'Mr.', 'Mr.', NULL),
('gm_configuration/GM_PDF_SALUTATION_MALE', 2, 'geehrter Herr', 'geehrter Herr', NULL),
('gm_configuration/GM_PDF_SALUTATION_FEMALE', 1, 'Mrs.', 'Mrs.', NULL),
('gm_configuration/GM_PDF_SALUTATION_FEMALE', 2, 'geehrte Frau', 'geehrte Frau', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_1', 1, 'your name \nyour street 1 \n\n12345 your city', 'your name \nyour street 1 \n\n12345 your city', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_1', 2, 'dein Name \ndeine Straße 1 \n\n12345 dein Ort', 'dein Name \ndeine Straße 1 \n\n12345 dein Ort', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_2', 1, 'your telephone\nyour telefax\nyour homepage\n your email', 'your telephone\nyour telefax\nyour homepage\n your email', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_2', 2, 'deine Telefonnummer\ndeine Faxnummer\ndeine Homepage\ndeine E-Mail', 'deine Telefonnummer\ndeine Faxnummer\ndeine Homepage\ndeine E-Mail', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_3', 1, 'your tax number\nyour VAT number\nyour jurisdiction\nyour information', 'your tax number\nyour VAT number\nyour jurisdiction\nyour information', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_3', 2, 'deine Steuernummer\ndeine USt-IdNr.\ndeine Gerichtsbarkeit\ndeine Informationen', 'deine Steuernummer\ndeine USt-IdNr.\ndeine Gerichtsbarkeit\ndeine Informationen', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_4', 1, 'Additional\ninformation\nin the fourth\ncolumn\n', 'Additional\ninformation\nin the fourth\ncolumn\n', NULL),
('gm_configuration/GM_PDF_FOOTER_CELL_4', 2, 'Zusätzliche\nInformationen\nin der vierten\nSpalte\n', 'Zusätzliche\nInformationen\nin der vierten\nSpalte\n', NULL);

INSERT INTO `gx_lang_configurations` (`key`, `language_id`, `value`, `default`, `sort_order`) VALUES
('gm_configuration/GM_PDF_HEADING_CONDITIONS', 1, 'Our T&C', 'Our T&C', NULL),
('gm_configuration/GM_PDF_HEADING_CONDITIONS', 2, 'Unsere AGB', 'Unsere AGB', NULL),
('gm_configuration/GM_PDF_HEADING_INFO_TEXT_INVOICE', 1, 'Invoice information', 'Invoice information', NULL),
('gm_configuration/GM_PDF_HEADING_INFO_TEXT_INVOICE', 2, 'Rechnungshinweis', 'Rechnungshinweis', NULL),
('gm_configuration/GM_PDF_HEADING_INFO_TEXT_PACKINGSLIP', 1, 'Delivery information', 'Delivery information', NULL),
('gm_configuration/GM_PDF_HEADING_INFO_TEXT_PACKINGSLIP', 2, 'Lieferhinweis', 'Lieferhinweis', NULL),
('gm_configuration/GM_PDF_HEADING_INVOICE', 1, 'Your invoice', 'Your invoice', NULL),
('gm_configuration/GM_PDF_HEADING_INVOICE', 2, 'Ihre Rechnung', 'Ihre Rechnung', NULL),
('gm_configuration/GM_PDF_HEADING_CANCELLATION_INVOICE', 1, 'Your cancellation invoice to invoice number {INVOICE_ID} on {DATE}', 'Your cancellation invoice to invoice number {INVOICE_ID} on {DATE}', NULL),
('gm_configuration/GM_PDF_HEADING_CANCELLATION_INVOICE', 2, 'Ihre Stornorechnung zur Rechnungsnummer {INVOICE_ID} vom {DATE}', 'Ihre Stornorechnung zur Rechnungsnummer {INVOICE_ID} vom {DATE}', NULL),
('gm_configuration/GM_PDF_HEADING_PACKINGSLIP', 1, 'Your packing slip', 'Your packing slip', NULL),
('gm_configuration/GM_PDF_HEADING_PACKINGSLIP', 2, 'Ihr Lieferschein', 'Ihr Lieferschein', NULL),
('gm_configuration/GM_PDF_HEADING_WITHDRAWAL', 1, 'Our right of withdrawal', 'Our right of withdrawal', NULL),
('gm_configuration/GM_PDF_HEADING_WITHDRAWAL', 2, 'Unser Widerrufsrecht', 'Unser Widerrufsrecht', NULL),
('gm_configuration/GM_PDF_INFO_TEXT_INVOICE', 1, 'your text for the invoice', 'your text for the invoice', NULL),
('gm_configuration/GM_PDF_INFO_TEXT_INVOICE', 2, 'dein Hinweistext für die Rechnung', 'dein Hinweistext für die Rechnung', NULL),
('gm_configuration/GM_PDF_INFO_TEXT_PACKINGSLIP', 1, 'your text for the packing slip', 'your text for the packing slip', NULL),
('gm_configuration/GM_PDF_INFO_TEXT_PACKINGSLIP', 2, 'dein Hinweistext für den Lieferschein', 'dein Hinweistext für den Lieferschein', NULL),
('gm_configuration/GM_PDF_INFO_TITLE_INVOICE', 1, 'Please note', 'Please note', NULL);

INSERT INTO `gx_lang_configurations` (`key`, `language_id`, `value`, `default`, `sort_order`) VALUES
('gm_configuration/GM_PDF_INFO_TITLE_INVOICE', 2, 'Beachten Sie bitte', 'Beachten Sie bitte', NULL),
('gm_configuration/GM_PDF_INFO_TITLE_PACKINGSLIP', 1, 'Please note', 'Please note', NULL),
('gm_configuration/GM_PDF_INFO_TITLE_PACKINGSLIP', 2, 'Beachten Sie bitte', 'Beachten Sie bitte', NULL),
('gm_configuration/GM_PDF_WITHDRAWAL', 1, 'Here could be your right of withdrawal.', 'Here could be your right of withdrawal.', NULL),
('gm_configuration/GM_PDF_WITHDRAWAL', 2, 'Hier könnte dein Widerrufsrecht stehen.', 'Hier könnte dein Widerrufsrecht stehen.', NULL),
('gm_configuration/GM_TITLE_STANDARD_META_TITLE', 1, '', '', NULL),
('gm_configuration/GM_TITLE_STANDARD_META_TITLE', 2, '', '', NULL),
('gm_configuration/GM_TITLE_STANDARD_META_TITLE_SEPARATOR', 1, ' - ', ' - ', NULL),
('gm_configuration/GM_TITLE_STANDARD_META_TITLE_SEPARATOR', 2, ' - ', ' - ', NULL),
('gm_configuration/meta/keywords', 1, '', '', NULL),
('gm_configuration/meta/keywords', 2, 'keywords,kommagetrennt', 'keywords,kommagetrennt', NULL),
('gm_configuration/meta/robots', 1, 'index,follow', 'index,follow', NULL),
('gm_configuration/meta/robots', 2, 'index,follow', 'index,follow', NULL),
('gm_configuration/GM_FOOTER', 2, '<a href=\"https://www.gambio.de\" rel=\"noopener\" target=\"_blank\">Onlineshop</a> by Gambio.de &copy; 2023', NULL, NULL);

INSERT INTO `gx_lang_configurations` (`key`, `language_id`, `value`, `default`, `sort_order`) VALUES
('gm_configuration/GM_FOOTER', 1, '<a href=\"https://www.gambio.com\" rel=\"noopener\" target=\"_blank\">Shopping Cart Software</a> by Gambio.com &copy; 2023', NULL, NULL);

