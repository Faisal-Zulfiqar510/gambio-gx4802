DROP TABLE IF EXISTS `google_adwords_client_customers`;
CREATE TABLE `google_adwords_client_customers` (
  `client_customer_id` varchar(12) NOT NULL,
  `primary` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`client_customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;