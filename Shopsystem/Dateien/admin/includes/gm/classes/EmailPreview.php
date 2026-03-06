<?php
/* --------------------------------------------------------------
   EmailPreview.php 2022-09-29
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

require_once DIR_FS_CATALOG . 'gm/inc/gm_save_template_file.inc.php';
require_once DIR_FS_CATALOG . 'gm/inc/gm_save_temp_template.inc.php';

/**
 * Class EmailPreview
 */
class EmailPreview
{
    protected $smarty;
    
    
    /**
     * EmailPreview constructor.
     */
    public function __construct()
    {
        $this->smarty               = MainFactory::create('GXSmarty');
        $this->smarty->template_dir = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
        $this->smarty->compile_dir  = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()
                ->getCompiledTemplatesFolder();
        $this->smarty->config_dir   = DIR_FS_CATALOG . 'lang';
    }
    
    
    /**
     * @param string $name
     * @param string $templateContent
     * @param string $type
     *
     * @return string
     * @throws SmartyException
     */
    public function render(string $name, string $templateContent, string $type = 'html'): string
    {
        $this->createTempTemplate($templateContent);
        $this->setTemplateSpecificVariables($name, $type);
        $this->setCommonVariables($type);
        $emailPreview = $this->renderTemplate($type);
        $this->deleteTempTemplate();
        
        return $emailPreview;
    }
    
    
    protected function createTempTemplate(string $content): void
    {
        gm_save_temp_template(gm_correct_config_tag(gm_remove_smarty_php_tags($content)));
    }
    
    
    /**
     * @param string $name
     * @param string $type
     */
    protected function setTemplateSpecificVariables(string $name, string $type): void
    {
        switch ($name) {
            case 'create_account_mail': // Kundenkonto erstellt
                $this->smarty->assign('content',
                                      ['MAIL_REPLY_ADDRESS' => '<a href="mailto:mail-reply-address@mail.de">mail-reply-address@mail.de</a>']);
                $this->smarty->assign('MESSAGE', 'Dies ist individueller Beispieltext.');
                $this->smarty->assign('COUPON_ID', 'Coupon1');
                $this->smarty->assign('WEBSITE', 'http://www.meineshopdomain.de');
                break;
            
            case 'new_password_mail': // Neues Passwort
                $this->smarty->assign('NEW_PASSWORD', 'abc123');
                break;
            
            case 'newsletter_mail': // Newsletter
                $this->smarty->assign('LINK', 'http://www.aktiverungslink.de');
                break;
            
            case 'order_mail': // Bestellbestätigung
                if ($type === 'html') {
                    $this->smarty->assign('address_label_customer',
                                          'Firma<br />
												Max Mustermann<br />
												Teststraße 1<br />
												Ortsteil<br />
												12345 Teststadt<br />
												Germany<br />
												Telefonnummer: 0123465789
												');
                } else {
                    $this->smarty->assign('address_label_customer',
                                          'Firma
												Max Mustermann
												Teststraße 1
												Ortsteil
												12345 Teststadt
												Germany
												Telefonnummer: 0123465789
												');
                }
                
                $this->smarty->assign('PAYMENT_METHOD', 'PayPal');
                $this->smarty->assign('oID', '1001');
                $this->smarty->assign('DATE', '01.01.2008');
                $this->smarty->assign('csID', '123');
                
                if ($type === 'html') {
                    $this->smarty->assign('address_label_shipping',
                                          'Firma<br />
												Max Mustermann<br />
												Teststraße 1<br />
												Ortsteil');
                    $this->smarty->assign('address_label_payment',
                                          'Firma<br />
												Max Mustermann<br />
												Teststraße 1<br />
												Ortsteil');
                } else {
                    $this->smarty->assign('address_label_shipping',
                                          'Firma
												Max Mustermann
												Teststraße 1
												Ortsteil');
                    $this->smarty->assign('address_label_payment',
                                          'Firma
												Max Mustermann
												Teststraße 1
												Ortsteil');
                }
                
                $this->smarty->assign('NAME', 'Max Mustermann');
                $this->smarty->assign('PAYMENT_INFO_HTML',
                                      'Bankverbindungsdaten bei Bezahlung per Vorkasse');
                $this->smarty->assign('NAME', 'Max Mustermann');
                $this->smarty->assign('COMMENTS', 'Anmerkungen zur Bestellung');
                $this->smarty->assign('COMMENTS', 'Anmerkungen zur Bestellung');
                $order[] = [
                    'PRODUCTS_QTY'              => '2',
                    'PRODUCTS_NAME'             => 'Testartikel',
                    'PRODUCTS_SHIPPING_TIME'    => 'auf Lager',
                    'PRODUCTS_ATTRIBUTES'       => 'Farbe:rot',
                    'PRODUCTS_MODEL'            => '00001',
                    'PRODUCTS_ATTRIBUTES_MODEL' => '00001R',
                    'PRODUCTS_SINGLE_PRICE'     => '11,00 EUR',
                    'PRODUCTS_PRICE'            => '22,00 EUR',
                ];
                $this->smarty->assign('order_data', $order);
                
                if ($type === 'html') {
                    $order_total[] = [
                        'TITLE' => '',
                        'TEXT'  => 'Zwischensumme: 22,00 EUR<br />
															Versicherter Versand (Versand nach: DE : 4 kg): 4,00 EUR<br />
															inkl. MwSt. 19%: 4,15 EUR<br />
															<strong>Summe: 26,00 EUR</strong>',
                    ];
                } else {
                    $order_total[] = [
                        'TITLE' => '',
                        'TEXT'  => 'Zwischensumme: 22,00 EUR
															Versicherter Versand (Versand nach: DE : 4 kg): 4,00 EUR
															inkl. MwSt. 19%: 4,15 EUR
															Summe: 26,00 EUR',
                    ];
                }
                
                $this->smarty->assign('order_total', $order_total);
                
                break;
            
            case 'password_verification_mail': // Passwortbestätigung
                $this->smarty->assign('LINK', 'http://www.bestaetigungslink.de');
                break;
            
            case 'send_gift_to_friend': // Gutschein
                $this->smarty->assign('AMMOUNT', '10,00 EUR');
                $this->smarty->assign('FROM_NAME', 'Max Mustermann');
                $this->smarty->assign('MESSAGE', 'Dies ist individueller Beispieltext.');
                $this->smarty->assign('GIFT_CODE', '132456');
                $this->smarty->assign('GIFT_LINK', 'http://www.gutscheinlink.de');
                break;
            
            case 'change_order_mail': // Admin: Änderung Bestellstatus
                $this->smarty->assign('NOTIFY_COMMENTS', 'Dies ist ein individueller Beispieltext.');
                $this->smarty->assign('ORDER_STATUS', 'versandt');
                break;
            
            case 'admin_create_account_mail': // Admin: Kundenkonto angelegt
                $shop_url = HTTP_SERVER . DIR_WS_CATALOG;
                $this->smarty->assign('URL', $shop_url);
                $this->smarty->assign('COMMENTS', 'Dies ist ein individueller Beispieltext.');
                $this->smarty->assign('EMAIL', 'meine@email.de');
                $this->smarty->assign('PASSWORD', '123456');
                break;
            
            case 'gift_accepted': // Admin: Gutschein freigeschaltet
                $this->smarty->assign('AMMOUNT', '10,00 EUR');
                break;
            
            case 'send_coupon': // Admin: Coupon senden
                $this->smarty->assign('MESSAGE', 'Dies ist ein individueller Beispieltext.');
                $this->smarty->assign('COUPON_ID', 'Coupon1');
                $this->smarty->assign('WEBSITE', 'http://www.meineshopdomain.de');
                break;
            
            case 'send_gift': // Admin: Gutschein senden
                $this->smarty->assign('MESSAGE', 'Dies ist ein individueller Beispieltext.');
                $this->smarty->assign('AMMOUNT', '10,00 EUR');
                $this->smarty->assign('GIFT_ID', '123456');
                $this->smarty->assign('GIFT_LINK', 'http://www.gutscheinlink.de');
                $this->smarty->assign('WEBSITE', 'http://www.meineshopdomain.de');
                break;
            
            case 'send_paylink':
                $this->smarty->assign('PAY_LINK',
                                      'http://paylink-address-here.com/a7s8f7f6e889a7ds7867sd');
                break;
            case 'invoice_mail':
                $this->smarty->assign('SALUTATION', 'geehrter');
                $this->smarty->assign('CUSTOMER_GENDER', 'm');
                $this->smarty->assign('CUSTOMER', 'Max Mustermann');
                $this->smarty->assign('INVOICE_ID', '1234567');
                $this->smarty->assign('ORDER_ID', '54321');
                $this->smarty->assign('DATE', '01.04.2016');
                break;
        }
    }
    
    
    /**
     * @param string $type
     */
    protected function setCommonVariables(string $type): void
    {
        $logoManager = MainFactory::create('GMLogoManager', 'gm_logo_mail');
        if ($logoManager->logo_use === '1') {
            $logo = $logoManager->get_logo();
        }
        
        $this->smarty->assign('gm_logo_mail', $logo ?? '');
        $this->smarty->assign('EMAIL_SIGNATURE_HTML', EMAIL_HTML_SIGNATURE);
        $this->smarty->assign('GENDER', 'm');
        $this->smarty->assign('NAME', 'Mustermann');
    }
    
    
    /**
     * @param string $type
     *
     * @return string
     * @throws SmartyException
     */
    protected function renderTemplate(string $type): string
    {
        $output = $this->smarty->fetch(DIR_FS_CATALOG . 'cache/gm_temp_email.html');
        
        // Convert preview HTML to text format.
        if ($type === 'txt') {
            $output = nl2br($output);
            $output = '<font face="Arial" size="2">' . $output;
            $output .= '</font>';
        }
        
        return $output;
    }
    
    
    protected function deleteTempTemplate(): void
    {
        // Remote the temporary email template file.
        unlink(DIR_FS_CATALOG . 'cache/gm_temp_email.html');
    }
}