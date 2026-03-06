<?php
/* --------------------------------------------------------------
   gm_modules_structure.php 2022-11-16
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------
*/

$t_show_installed_modules_menu = false;
$t_display_installed_modules = false;
if($module_type == 'payment')
{
	$t_show_installed_modules_menu = true;
	$t_display_installed_modules = true;
}
$t_show_missing_modules_menu = true;
$t_display_missing_modules = false;
$t_ignore_files_array = array();
$t_display_missing_modules_menu = null;

switch($_GET['set'])
{
	case 'payment':
		$t_gm_structure_array = array(
			'amazonadvpay',
			array(
				'TITLE' => 'BillSAFE',
				'MODULES' => array(
					'billsafe_3_installment',
					'billsafe_3_invoice'
				),
				'DISPLAY' => true
			),

			'cash',
			'eustandardtransfer',
			'sepa',
			'cod',
			'invoice',
			'moneyorder',
			'paypal3',
			array(
				'TITLE' => 'Heidelpay',
				'MODULES' => array(
					'hp',
					'hpcc',
					'hpdc',
					'hpdd',
					'hpddpg',
					'hpeps',
					'hpgp',
					'hpidl',
					'hppp',
					'hppay',
					'hpsu',
					'hpbs',
					'hpiv',
					'hpivpg',
					'hpbp',
					'hppf',
					'hpmk'
				),
				'DISPLAY' => true
			),
			array(
				'TITLE' => 'iPayment',
				'MODULES' => array(
					'ipayment',
					'ipaymentelv',
					'ipayment_cc',
					'ipayment_elv',
					'ipayment_pp'
				),
				'DISPLAY' => true
			),
			'luupws',
			array(
				'TITLE' => 'Masterpayment',
				'MODULES' => array(
					'masterpayment_anzahlungskauf',
					'masterpayment_config',
					'masterpayment_credit_card',
					'masterpayment_debit_card',
					'masterpayment_elv',
					'masterpayment_finanzierung',
					'masterpayment_phone',
					'masterpayment_ratenzahlung',
					'masterpayment_rechnungskauf',
					'masterpayment_sofortbanking'
				),
				'DISPLAY' => true
			),
			array(
				'TITLE' => 'Moneybookers.com',
				'MODULES' => array(
					'moneybookers',
					'amoneybookers',
					'moneybookers_cc',
					'moneybookers_cgb',
					'moneybookers_csi',
					'moneybookers_elv',
					'moneybookers_giropay',
					'moneybookers_ideal',
					'moneybookers_mae',
					'moneybookers_netpay',
					'moneybookers_psp',
					'moneybookers_pwy',
					'moneybookers_sft',
					'moneybookers_wlt'
				),
				'DISPLAY' => true,
				'GHOST' => true,
			),
			array(
				'TITLE' => 'PAYONE',
				'MODULES' => array(
					'payone_cc',
					'payone_elv',
					'payone_cod',
					'payone_otrans',
					'payone_wlt',
					'payone_safeinv',
					'payone_installment',
					'payone_invoice',
					'payone_prepay',
				),
				'DISPLAY' => true,
			),
			'paygate_ssl',
			array(
				'TITLE' => 'Postfinance',
				'MODULES' => array(
					'postfinanceag_basic',
					'postfinanceag_diners',
					'postfinanceag_mastercard',
					'postfinanceag_amex',
					'postfinanceag_visa',
					'postfinanceag_twint',
				),
				'DISPLAY' => true
			),
			array(
			    'TITLE' => 'Postfinance v2',
                'MODULES' => array(
                    'swixpostfinancecheckout_creditdebitcard',
                    'swixpostfinancecheckout_paypal',
                    'swixpostfinancecheckout_postfinancecard',
                    'swixpostfinancecheckout_postfinanceefinance',
                    'swixpostfinancecheckout_powerpay',
                    'swixpostfinancecheckout_twint',
                ),
                'DISPLAY' => true,
            ),
			array(
				'TITLE' => 'sofort&uuml;berweisung und weitere SOFORT-Produkte',
				'MODULES' => array(
					'sofort_lastschrift',
					'sofort_sofortlastschrift',
					'sofort_sofortueberweisung',
					'sofort_sofortvorkasse',
					'sofort_ideal'
				),
				'DISPLAY' => true
			),
			'sofortuerberweisung_direct',
			array(
				'TITLE' => 'United Online Services',
				'MODULES' => array(
					'uos_giropay_modul',
					'uos_gp_modul',
					'uos_kreditkarte_modul',
					'uos_lastschrift_at_modul',
					'uos_lastschrift_de_modul',
					'uos_vorkasse_modul'
				),
				'DISPLAY' => true
			),
			array(
				'TITLE' => 'VR-Pay',
				'MODULES' => array(
					'vrepay_elv',
					'vrepay_giropay',
					'vrepay_kreditkarte'
				),
				'DISPLAY' => true
			),
			'worldpay',
            array(
                'TITLE' => 'Blacklisted Modules',
                'MODULES' => array(
                    'paypalgambio_alt',
                    'paypal_gambio',
                    'paypalng',
                    'paypal',
                    'paypalexpress',
                ),
                'DISPLAY' => false,
            )
		);

		break;

	case 'shipping':
		$t_gm_structure_array = array(
										'gambioultra',
										'chronopost',
										'dp',
										'dhl',
										'dpd',
										'fedexeu',
										'hermesprops',
										'interkurier',
										'ap',
										'flat',
										'chp',
										'selfpickup',
										'upse',
										'ups',
										'zones',
										'b2czones',
										'table',
										'item',
										'freeamount',
										'zonese'
									);

		break;

	case 'ordertotal':
	case 'order_total':
		$t_gm_structure_array = array(
										'ot_billsafe3',
										'ot_cod_fee',
										'ot_coupon',
										'ot_discount',
										'ot_gambioultra',
										'ot_gm_tax_free',
										'ot_gv',
										'ot_tsexcellence',
										'ot_loworderfee',
										'ot_payment',
										'ot_sofort',
										'ot_ps_fee',
										'ot_shipping',
										'ot_subtotal',
										'ot_subtotal_no_tax',
										'ot_tax',
										'ot_total',
										'ot_total_netto',
										'ot_paypal3_instfee',
									);

		break;
}
