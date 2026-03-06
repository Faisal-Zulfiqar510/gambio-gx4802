--
-- GAMBIO HUB - INSTALLATION FILE
--
-- Compatibility: 4.1.1.x or newer
--
-- Use this file when performing a new shop installation, so that all Gambio Hub related changes make their way into
-- the database.
--
-- The queries have to be execute at the very end of the database setup. It is therefore recommended to use this file
-- in the following path: "gambio_installer/sql/zz_gambio_hub.sql"
--

INSERT INTO `gx_configurations` (`key`, `value`, `default`, `type`, `sort_order`)
VALUES ('configuration/MODULE_PAYMENT_GAMBIO_HUB_STATUS', 'False', 'False', 'switcher', 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_ALLOWED', '', '', null, 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_SORT_ORDER', '0', '0', null, 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_ZONE', '0', '0', 'geo-zone', 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_ORDER_STATUS_ID', '0', '0', 'order-status', 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_URL', 'https://core-api.gambiohub.com/a/api.php/api/v1', 'https://core-api.gambiohub.com/a/api.php/api/v1', null, 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_SETTINGS_APP_URL', 'https://gui.gambiohub.com/a/settings', 'https://gui.gambiohub.com/a/settings', null, 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_ACCOUNT_APP_URL', 'https://gui.gambiohub.com/a/account', 'https://gui.gambiohub.com/a/account', null, 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_IP_LIST_URL', 'https://core-api.gambiohub.com/trust/hub_hosts.json', 'https://core-api.gambiohub.com/trust/hub_hosts.json', null, 0),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_IP_WHITELIST', '', '', null, 0),
('gm_configuration/GAMBIO_HUB_CLIENT_KEY', '', '', null, null),
('gm_configuration/GAMBIO_HUB_MONEY_ORDER_PAY_TO', '', '', null, null),
('gm_configuration/GAMBIO_HUB_CURL_TIMEOUT', '30', '30', null, null),
('gm_configuration/GAMBIO_HUB_PHRASES_URL', 'https://core-api.gambiohub.com/trust/hub_phrases.json', 'https://core-api.gambiohub.com/trust/hub_phrases.json', null, null),
('configuration/MODULE_PAYMENT_GAMBIO_HUB_DATA_OBSERVER', 'True', 'True', 'switcher', 0);

UPDATE `gx_configurations`
SET `value` = 'gambio_hub.php'
WHERE `key` = 'configuration/MODULE_PAYMENT_INSTALLED';

ALTER TABLE `orders`
	ADD COLUMN `gambio_hub_module` VARCHAR(32) NOT NULL DEFAULT '' AFTER `exported`,
	ADD COLUMN `gambio_hub_module_title` VARCHAR(255) NOT NULL DEFAULT '' AFTER `gambio_hub_module`,
	ADD COLUMN `gambio_hub_transaction_code` VARCHAR(64) NOT NULL DEFAULT '' AFTER `gambio_hub_module_title`,
	ADD COLUMN `gambio_hub_transaction_mode` VARCHAR(64) NOT NULL DEFAULT '' AFTER `gambio_hub_transaction_code`;

INSERT INTO `version_history` SET
    `version` = '1.26.4.4',
    `name` = 'Gambio Hub v1.26.4.4',
    `revision` = '0',
    `type` = 'update',
    `installation_date` = NOW(),
    `mysql_version` = VERSION(),
    `installed` = '1';

INSERT INTO `version_history` SET
    `version` = '1.4',
    `name` = 'Klarna On-Site Messaging v1.4',
    `revision` = '0',
    `type` = 'update',
    `installation_date` = NOW(),
    `mysql_version` = VERSION(),
    `installed` = '1';
