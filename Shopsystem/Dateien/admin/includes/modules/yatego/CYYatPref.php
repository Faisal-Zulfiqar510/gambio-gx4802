<?php
/* --------------------------------------------------------------
   * $Id: CYYatPref.php,v 1.4 2008/02/17 10:40:47 tobias Exp $
   * Konfiguration des Exports
   --------------------------------------------------------------*/

class CYYatPref {
    var $currency; // Währung, die exportiert wird
    var $customer_status; // Kundengruppe zur Preisberechnung
    var $language; // Sprache der Beschreibungen
    var $username; // Benutzername bei Yatego
    var $password; // Passwort bei Yatego
    var $quantities; // Export der Lagerbestände
    var $exportall; // Export aller Artikel
    var $h2longdesc; // Artikelname in <h2> vor Langbeschreibung
    var $genshortdesc; // Erstellen der Kurzbeschreibung
    var $genpackagesize; // Erstellen der Grundpreis
    var $properties; // Artikeleigenschaften oder Artikelattribute
    var $exportean; // Export EAN

    public function __construct() {
        // Initialisierung mit den Werten aus der Datenbank
        $this->currency = defined('YATEGO_CURRENCY') ? YATEGO_CURRENCY : null;
        $this->customer_status = defined('YATEGO_CUSTOMER_STATUS') ? YATEGO_CUSTOMER_STATUS : null;
        $this->language = defined('YATEGO_LANGUAGE') ? YATEGO_LANGUAGE : null;
        $this->username = defined('YATEGO_USERNAME') ? YATEGO_USERNAME : null;
        $this->password = defined('YATEGO_PASSWORD') ? YATEGO_PASSWORD : null;
        $this->quantities = defined('YATEGO_QUANTITIES') ? YATEGO_QUANTITIES : null;
        $this->exportall = defined('YATEGO_EXPORTALL') ? YATEGO_EXPORTALL : null;
        $this->h2longdesc = defined('YATEGO_H2LONGDESC') ? YATEGO_H2LONGDESC : null;
        $this->genshortdesc = defined('YATEGO_GENSHORTDESC') ? YATEGO_GENSHORTDESC : null;
        $this->genpackagesize = defined('YATEGO_GENPACKAGESIZE') ? YATEGO_GENPACKAGESIZE : null;
        $this->properties = defined('YATEGO_PROPERTIES') ? YATEGO_PROPERTIES : null;
        $this->exportean = defined('YATEGO_EXPORTEAN') ? YATEGO_EXPORTEAN : null;
    }

    /* --------------------------------------------------------------
       * Ändern der Währung
       --------------------------------------------------------------*/
    function setCurrency($curr) {
        if($this->currency != $curr) {
            $this->currency = $curr;
            xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->currency . "' WHERE `key` = 'configuration/YATEGO_CURRENCY'");
            return true;
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern der Kundengruppe
       --------------------------------------------------------------*/
    function setCustomerStatus($cust) {
        if($this->customer_status != $cust) {
            $this->customer_status = $cust;
            xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->customer_status . "' WHERE `key` = 'configuration/YATEGO_CUSTOMER_STATUS'");
            return true;
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern der Sprache
       --------------------------------------------------------------*/
    function setLanguage($lang) {
        if($this->language != $lang) {
            $this->language = $lang;
            xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->language . "' WHERE `key` = 'configuration/YATEGO_LANGUAGE'");
            return true;
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern des Yatego Benutzernamens
       --------------------------------------------------------------*/
    function setUsername($user) {
        if($this->username != $user) {
            $this->username = $user;
            xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . xtc_db_input($this->username) . "' WHERE `key` = 'configuration/YATEGO_USERNAME'");
            return true;
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern des Yatego Passworts
       --------------------------------------------------------------*/
    function setPassword($pass) {
        if($this->password != $pass) {
            $this->password = $pass;
            xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->password . "' WHERE `key` = 'configuration/YATEGO_PASSWORD'");
            return true;
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern der Lagerbestände
       --------------------------------------------------------------*/
    function setQuantities($quan) {
        if($this->quantities != $quan) {
            $this->quantities = $quan;
            if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->quantities . "' WHERE `key` = 'configuration/YATEGO_QUANTITIES'")) {
                return true;
            }
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern der Option zum Exportieren aller Artikel
       --------------------------------------------------------------*/
    function setExportAll($exp) {
        if($this->exportall != $exp) {
            $this->exportall = $exp;
            if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->exportall . "' WHERE `key` = 'configuration/YATEGO_EXPORTALL'")) {
                return true;
            }
            xtc_db_query("TRUNCATE TABLE yatego_articles");
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern des Artikelnamens vor Langbeschreibung
       --------------------------------------------------------------*/
    function setH2longdesc($h2) {
        if($this->h2longdesc != $h2) {
            $this->h2longdesc = $h2;
            if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->h2longdesc . "' WHERE `key` = 'configuration/YATEGO_H2LONGDESC'")) {
                return true;
            }
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern der Erstellung der Kurzbeschreibung
       --------------------------------------------------------------*/
    function setGenshortdesc($gen) {
        if($this->genshortdesc != $gen) {
            $this->genshortdesc = $gen;
            if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->genshortdesc . "' WHERE `key` = 'configuration/YATEGO_GENSHORTDESC'")) {
                return true;
            }
        }
        return false;
    }


    /* --------------------------------------------------------------
       * Ändern der Erstellung der Grundpreis
       --------------------------------------------------------------*/
    function setGenpackagesize($gen) {
        if($this->genpackagesize != $gen) {
            $this->genpackagesize = $gen;
            if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='".$this->genpackagesize."' WHERE `key` = 'configuration/YATEGO_GENPACKAGESIZE'")) {
                return true;
            }
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Ändern der Variantenoption
       --------------------------------------------------------------*/
        function setProperties($gen) {
            if($this->properties != $gen) {
                $this->properties = $gen;
                if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='".$this->properties."' WHERE `key` = 'configuration/YATEGO_PROPERTIES'")) {
                    return true;
                }
            }
            return false;
        }


    /* --------------------------------------------------------------
       * Ändern der Option zum Exportieren der EAN
       --------------------------------------------------------------*/
    function setExportEAN($exp) {
        if($this->exportean != $exp) {
            $this->exportean = $exp;
            if(xtc_db_query("UPDATE `gx_configurations` SET `value` ='" . $this->exportean . "' WHERE `key` = 'configuration/YATEGO_EXPORTEAN'")) {
                return true;
            }
        }
        return false;
    }

    /* --------------------------------------------------------------
       * Anzeige der Einstellungen
       * Auswahl wird per POST an yatego.php geschickt
       --------------------------------------------------------------*/
    function display() {

        $link_yatego = xtc_href_link('yatego.php');
        if (strpos($link_yatego, '?') !== false)
        {
            $link_yatego .= '&';
        }
        else
        {
            $link_yatego .= '?';
        }

        echo '<div class="gx-container"><form class="grid" action="' . $link_yatego . 'module=yatego&amp;section=preferences" method="post" accept-charset="' . $_SESSION['language_charset'] . '">';
        ?>
        <fieldset class="span6">
        <h3>Export Einstellungen</h3>
        <div class="control-group">
            <label for="yatego_language">Sprache</label>
            <select id="yatego_language" name="yatego_language" class="input-default">
            <?php
            // Es werden nur die Sprachen angezeigt, die auch installiert sind.
            // Hierfür wird die Klasse des XT:Commerce verwendet
            if (!isset($lng) || !is_object($lng)) {
                include(DIR_WS_CLASSES . 'language.php');
                $lng = new language;
            }
            reset($lng->catalog_languages);
            foreach($lng->catalog_languages as $key => $value) {
                echo '<option '.($value['id']==$this->language?'selected':'').' value="'.$value['id'].'">'.$value['name'].'</option>';
            }
            ?>
            </select>
        </div>
        <div class="control-group">
            <label for="yatego_currency">W&auml;hrung</label>
            <select id="yatego_currency" name="yatego_currency" class="input-default">
                <?php
                $currencies=xtc_db_query("SELECT title, code FROM ".TABLE_CURRENCIES);
                while($currencies_data=xtc_db_fetch_array($currencies)) {
                    echo '<option '.($currencies_data['code']==$this->currency?'selected':'').' value="'.$currencies_data['code'].'">'.$currencies_data['title'].'</option>';
                }
                ?>
            </select>
        </div>
        <div class="control-group">
            <label for="yatego_customer_status">Kundengruppe</label>
            <select id="yatego_customer_status" name="yatego_customer_status" class="input-default">
                <?php
                $customers_statuses_array = xtc_get_customers_statuses();
                foreach($customers_statuses_array as $value) {
                    echo '<option '.($value['id']==$this->customer_status?'selected':'').' value="'.$value['id'].'">'.$value['text'].'</option>';
                }
                ?>
            </select>
        </div>
        <div class="control-group">
            <label for="yatego_properties">Varianten</label>
            <select id="yatego_properties" name="yatego_properties" class="input-default">
                <?php
                $properties_array[] = array(
                    'id' => 'properties',
                    'text' => 'Artikeleigenschaften'
                );
                $properties_array[] = array(
                    'id' => 'attributes',
                    'text' => 'Artikelattribute'
                );
                foreach($properties_array as $value) {
                    echo '<option '.($value['id']==$this->properties?'selected':'').' value="'.$value['id'].'">'.$value['text'].'</option>';
                }
                ?>
            </select>
        </div>
        <?php
		echo '<div class="control-group">
				<label for="yatego_username">Yatego Benutzername</label>
				<input type="text" name="yatego_username" id="yatego_username" value="' . htmlspecialchars($this->username) . '" class="input-default" />
			</div>
			<div class="control-group">
				<label for="yatego_password">Yatego Passwort</label>
				<input type="password" name="yatego_password" id="yatego_password" value="' . htmlspecialchars($this->password) . '" class="input-default" />
			</div>
			<div class="control-group">
				<label for="yatego_quantities">Lagerbest&auml;nde exportieren</label>
				<div class="gx-container" data-gx-widget="checkbox">
				    <input class="pull-left" type="checkbox" name="yatego_quantities" id="yatego_quantities" value="1" '. ($this->quantities == 'false' ? '' : 'checked="checked"') .' />
				</div>
			</div>
			<div class="control-group">
				<label for="yatego_exportall">Alle Artikel exportieren</label>
				<div class="gx-container" data-gx-widget="checkbox">
				    <input class="pull-left" type="checkbox" name="yatego_exportall" id="yatego_exportall" value="1" '. ($this->exportall == 'false' ? '' : 'checked="checked"') .' />
				</div>
			</div>
			<div class="control-group">
				<label for="yatego_genshortdesc">Keywords exportieren</label>
				<div class="gx-container" data-gx-widget="checkbox">
				    <input class="pull-left" type="checkbox" name="yatego_genshortdesc" id="yatego_genshortdesc" value="1" '. ($this->genshortdesc == 'false' ? '' : 'checked="checked"') .' />
				</div>
			</div>
			<div class="control-group">
				<label for="yatego_genpackagesize">Grundpreis generieren</label>
				<div class="gx-container" data-gx-widget="checkbox">
				    <input class="pull-left" type="checkbox" name="yatego_genpackagesize" id="yatego_genpackagesize" value="1" '. ($this->genpackagesize == 'false' ? '' : 'checked="checked"') .' />
				</div>
			</div>
			<div class="control-group">
				<label for="yatego_genpackagesize">EAN exportieren</label>
				<div class="gx-container" data-gx-widget="checkbox">
				    <input class="pull-left" type="checkbox" name="yatego_exportean" id="yatego_exportean" value="1" '. ($this->exportean == 'false' ? '' : 'checked="checked"') .' />
				</div>
			</div>
			<br>
			<input type="submit" class="button" style="width:auto" value="Speichern" />
			</fieldset>
			</form>
			</div>';
	}
}