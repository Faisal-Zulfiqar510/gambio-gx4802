<?php
/* --------------------------------------------------------------
   cross_selling.php 2022-11-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------


   (c) 2005 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: cross_selling.php 799 2005-02-23 18:08:06Z novalis $)

   Released under the GNU General Public License
   --------------------------------------------------------------*/

defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');

$languageTextManager = MainFactory::create_object('LanguageTextManager', array(), true);

// select article data
$article_query = "SELECT products_name FROM ".TABLE_PRODUCTS_DESCRIPTION." WHERE products_id='".(int) $_GET['current_product_id']."' and language_id = '".(int)$_SESSION['languages_id']."'";
$article_result = xtc_db_query($article_query);
$article_data = xtc_db_fetch_array($article_result);
$productId = (int)$_GET['current_product_id'];

$cross_sell_groups = xtc_get_cross_sell_groups();

$cPath = $_GET['cPath'] ?? null;

function buildCAT($catID) {

	$cat = array ();

	while (getParent($catID) != 0 || $catID != 0) {
		$cat_select = xtc_db_query("SELECT categories_name FROM ".TABLE_CATEGORIES_DESCRIPTION." WHERE categories_id='".(int)$catID."' and language_id='".(int)$_SESSION['languages_id']."'");
		$cat_data = xtc_db_fetch_array($cat_select);
		$catID = getParent($catID);
		$cat[] = htmlspecialchars($cat_data['categories_name']);

	}

	$catStr = implode(' > ', $cat);

	return $catStr;
}

function getParent($catID) {
	$parent_query = xtc_db_query("SELECT parent_id FROM ".TABLE_CATEGORIES." WHERE categories_id='".(int)$catID."'");
	$parent_data = xtc_db_fetch_array($parent_query);
	return $parent_data['parent_id'] ?? null;
}
?>
    <table width="100%" cellspacing="0" cellpadding="2" data-gx-widget="single_checkbox" class="gx-container" style="margin-bottom: 24px">
      <tr>
        <td>
            <div class="pageHeading">
                <div class="page-nav-title"><?php echo CROSS_SELLING.' : ' . htmlspecialchars($article_data['products_name']); ?></div>
                <div class="page-nav-tabs">
                    <div class="nav-tab">
                        <a href="<?php echo xtc_href_link(
                            FILENAME_CATEGORIES,
                            "pID={$productId}&action=new_product&cPath={$cPath}"
                        ); ?>">
                            <?php echo $languageTextManager->get_text('TAB_GENERAL', 'admin_product_page'); ?>
                        </a>
                    </div>
                    <div class="nav-tab">
                        <a href="<?php echo xtc_href_link(
                            'properties_combis.php',
                            "products_id={$productId}&action=edit_category"
                        ); ?>">
                            <?php echo $languageTextManager->get_text('TAB_VARIANTS', 'admin_product_page'); ?>
                        </a>
                    </div>
                    <div class="nav-tab">
                        <a href="<?php echo xtc_href_link("products/{$productId}/options"); ?>">
                            <?php echo $languageTextManager->get_text('TAB_OPTIONS', 'admin_product_page'); ?>
                        </a>
                    </div>
                    <div class="nav-tab">
                        <a href="<?php echo xtc_href_link("products/{$productId}/downloads"); ?>">
                            <?php echo $languageTextManager->get_text('TAB_DOWNLOADS', 'admin_product_page'); ?>
                        </a>
                    </div>
                    <div class="nav-tab">
                        <?php
                        $query     = "SELECT specials_id FROM specials WHERE products_id = {$productId}";
                        $result    = xtc_db_query($query);
                        $specialId = 0;
                        if (xtc_db_num_rows($result)) {
                            $row       = xtc_db_fetch_array($result);
                            $specialId = (int)$row['specials_id'];
                        }
                        $specialUrlParams = 'new&pID=' . $productId;
                        if ($specialId) {
                            $specialUrlParams = 'edit&sID=' . $specialId;
                        }
                        ?>
                        <a href="<?php echo xtc_href_link(FILENAME_SPECIALS, 'action=' . $specialUrlParams); ?>">
                            <?php echo $languageTextManager->get_text('BUTTON_SPECIAL', 'admin_buttons'); ?>
                        </a>
                    </div>
                    <div class="nav-tab no-link">
                        <?php echo $languageTextManager->get_text('TAB_CROSSSELLING', 'admin_product_page'); ?>
                    </div>
                </div>
                <style>.pageHeading > .page-nav-title {
                        margin-top: 0 !important;
                    }</style>
            </div>
		</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
	  <tr>
        <td>

        <?php

echo xtc_draw_form('cross_selling', FILENAME_CATEGORIES, $cPath ? "cPath={$cPath}" : '', 'POST', '');
echo xtc_draw_hidden_field('action', 'edit_crossselling');
echo xtc_draw_hidden_field('special', 'edit');
echo xtc_draw_hidden_field('current_product_id', $_GET['current_product_id']);
echo xtc_draw_hidden_field('cPath', $_GET['cPath'] ?? null);
?>


 <table width="100%" border="0" cellspacing="0" cellpadding="2" style="margin-bottom: 24px" data-gx-compatibility="row_selection">
  <tr class="dataTableHeadingRow">
    <td class="dataTableHeadingContent"><?php echo HEADING_DEL; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_SORTING; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_GROUP; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_MODEL; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_NAME; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_CATEGORY; ?></td>
  </tr>
<?php

$cross_query = "SELECT
                    cs.ID,
                    cs.products_id,
                    pd.products_name,
                    cs.sort_order,
                    p.products_model,
                    p.products_id,
                    cs.products_xsell_grp_name_id
                FROM
                    " . TABLE_PRODUCTS_XSELL . " cs,
                    " . TABLE_PRODUCTS_DESCRIPTION . " pd,
                    " . TABLE_PRODUCTS . " p
                WHERE
                    cs.products_id = '" . (int)$_GET['current_product_id']. "' AND
                    cs.xsell_id = p.products_id AND
                    p.products_id = pd.products_id AND
                    pd.language_id = '" . (int)$_SESSION['languages_id'] . "'
                ORDER BY cs.sort_order";
$cross_query = xtc_db_query($cross_query);
if (!xtc_db_num_rows($cross_query)) {
?>
  <tr class="dataTableRow">
    <td class="dataTableContent gm_strong categories_view_data" colspan="6"><?php echo GM_TITLE_NO_ENTRY; ?></td>
  </tr>
<?php


}
while ($cross_data = xtc_db_fetch_array($cross_query)) {
	$categorie_query = xtc_db_query("SELECT
		                                            categories_id
		                                            FROM ".TABLE_PRODUCTS_TO_CATEGORIES."
		                                            WHERE products_id='".$cross_data['products_id']."' LIMIT 0,1");
	$categorie_data = xtc_db_fetch_array($categorie_query);
?>

  <tr class="dataTableRow row_selection">
    <td class="dataTableContent categories_view_data"><input type="checkbox" name="ids[]" value="<?php echo $cross_data['ID']; ?>"></td>
    <td class="dataTableContent categories_view_data"><input name="sort[<?php echo $cross_data['ID']; ?>]" type="text" size="3" value="<?php echo $cross_data['sort_order']; ?>"></td>

    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo xtc_draw_pull_down_menu('group_name['.$cross_data['ID'].']',$cross_sell_groups,$cross_data['products_xsell_grp_name_id']); ?></td>

    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo htmlspecialchars($cross_data['products_model']); ?>&nbsp;</td>
    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo htmlspecialchars($cross_data['products_name']); ?>&nbsp;</td>
    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo buildCAT($categorie_data['categories_id']); ?>&nbsp;</td>
  </tr>

<?php } ?>
</table>

<input type="submit" class="button" name="save_original" value="<?php echo BUTTON_SAVE; ?>">
<input type="submit" class="button" name="gm_update" value="<?php echo BUTTON_UPDATE; ?>">
<div data-gx-widget="button_dropdown" data-button_dropdown-disabled_state="true">
    <div data-use-button_dropdown="true"
         data-custom_caret_btn_class="btn-primary"
         data-gx-compatibility="categories/categories_product_controller">
	    <button class="btn btn-primary"></button>
        <ul></ul>
    </div>
</div>
</form>
</td>
</tr>

<tr>
<td>
<br />
    <br />
    <br />
<h4><?php echo CROSS_SELLING_SEARCH; ?></h4>
<?php
	echo xtc_draw_form('product_search', FILENAME_CATEGORIES, '', 'GET');
	echo xtc_draw_hidden_field('action', 'edit_crossselling');
	echo xtc_draw_hidden_field('current_product_id', $_GET['current_product_id']);
	echo xtc_draw_hidden_field('cPath', $_GET['cPath'] ?? null);
?>
<?php
    echo xtc_draw_input_field('search', '', 'style="font-size: 14px; height: 25px; float: left; margin-right: 5px;"');
	echo '<input type="submit" class="btn btn-primary" onClick="this.blur();" value="' . BUTTON_SEARCH . '"/>';
?>
</form>
</td>
</tr>
<tr>
<td>

<?php


	// search results
	if (!empty($_GET['search'])) {
		echo xtc_draw_form('product_search', FILENAME_CATEGORIES, xtc_get_all_get_params(), 'POST');
		echo xtc_draw_hidden_field('special', 'add_entries');
?>
 <table width="100%" border="0" cellspacing="0" cellpadding="2" style="margin-bottom: 24px" data-gx-compatibility="row_selection">
  <tr class="dataTableHeadingRow">
    <td class="dataTableHeadingContent"><?php echo HEADING_ADD; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_GROUP; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_MODEL; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_NAME; ?></td>
    <td class="dataTableHeadingContent"><?php echo HEADING_CATEGORY; ?></td>
  </tr>
  <?php

  $search_query = "SELECT * FROM
                        " . TABLE_PRODUCTS_DESCRIPTION .  " pd,
                        " . TABLE_PRODUCTS  . " p
                    WHERE
                        p.products_id = pd.products_id AND
                        pd.language_id = '" . (int)$_SESSION['languages_id'] . "' AND
                        p.products_id != '" . (int)$_GET['current_product_id'] . "' AND
                        (pd.products_name LIKE '%" . xtc_db_input($_GET['search']) . "%' OR
                        p.products_model LIKE '%" . xtc_db_input($_GET['search']) . "%')";
  $search_query = xtc_db_query($search_query);

		while ($search_data = xtc_db_fetch_array($search_query)) {
			$categorie_query = xtc_db_query("SELECT
						                                            categories_id
						                                            FROM ".TABLE_PRODUCTS_TO_CATEGORIES."
						                                            WHERE products_id='".$search_data['products_id']."' LIMIT 0,1");
			$categorie_data = xtc_db_fetch_array($categorie_query);
?>
  <tr class="dataTableRow row_selection">
    <td class="dataTableContent categories_view_data"><input type="checkbox" name="ids[]" value="<?php echo $search_data['products_id']; ?>"></td>
    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo xtc_draw_pull_down_menu('group_name['.$search_data['products_id'].']',$cross_sell_groups); ?></td>
    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo htmlspecialchars($search_data['products_model']); ?>&nbsp;</td>
    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo htmlspecialchars($search_data['products_name']); ?>&nbsp;</td>
    <td class="dataTableContent categories_view_data" style="text-align: left;"><?php echo buildCAT($categorie_data['categories_id']); ?>&nbsp;</td>
  </tr>

<?php


		}
?>

</table>
<input type="submit" name="product_search_submit" class="button remove-margin" value="<?php echo BUTTON_SAVE; ?>" disabled>
</form>
<?php } ?>

</td>
</tr>
</td>
<script type="text/javascript">
	// Save buttons manipulation upon form changes #64823
    $(document).ready(function() {
	    /**
	     * product_search form changes
	     */
	    $('form[name="cross_selling"] input, form[name="cross_selling"] select').change(function() {
		    $(
		    	'form[name="cross_selling"] [type="button"], ' +
			    'form[name="cross_selling"] [type="submit"], ' +
			    'form[name="cross_selling"] :button'
		    ).each(function(){
			    $(this).prop('disabled', false);
		    });
	    });

	    /**
	     * product_search form changes
	     * Note: only checking for checkbox changes as it is the only action that is needed to guide the customer
	     */
	    $('form[name="product_search"] input[type=checkbox]').change(function() {
		    // check for count of selected checkboxes
		    var productSearchSubmitBtnDisabled = true;
		    if($('form[name="product_search"] input[name="ids[]"]').filter(':checked').length > 0) {
			    productSearchSubmitBtnDisabled = false;
		    }
		    $('form[name="product_search"] :input[name="product_search_submit"]').prop('disabled', productSearchSubmitBtnDisabled);
	    });
    });
</script>
<?php

    /** Returns true, if at least one product in the ist is a
     *  real product (product#isProduct method returns true). */
    function atLeastOneRecommendationIsProducts($recommendations) {
    	foreach ($recommendations as $recommendation) {
            if ($recommendation->isProduct()) {
            	return true;
            }
    	}
    	return false;
    }

?>
</table>