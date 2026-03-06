<?php
/* --------------------------------------------------------------
   linked_categories.inc.php 2022-07-29
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * #####################################################################################################################
 * Set linked categories
 * #####################################################################################################################
 */

$query       = 'SELECT categories_id FROM products_to_categories WHERE products_id = '
               . (isset($pInfo->products_id) ? (int)$pInfo->products_id : 0) . ' ORDER BY categories_id';
$result      = xtc_db_query($query);
$categoryIds = [];
while ($row = xtc_db_fetch_array($result)) {
    $categoryIds[] = (int)$row['categories_id'];
}

if (isset($current_category_id)) {
    if (count($categoryIds) > 0 && in_array((int)$current_category_id, $categoryIds)) {
        unset($categoryIds[array_search((int)$current_category_id, $categoryIds)]);
        array_unshift($categoryIds, (int)$current_category_id);
        
        // reset keys
        $categoryIds = array_values($categoryIds);
    } elseif (count($categoryIds) === 0) {
        $categoryIds[] = (int)$current_category_id;
    }
}
$categoryArray = xtc_get_category_tree(0, '&nbsp;&nbsp;&nbsp;');
sort($categoryIds);
/**
 * Define if a multi select should be used instead of an usual.
 * When the amount of all categories multiplied with amount of the linked product categories
 * is greater than 1200, a multi select box will be displayed.
 */
$multiSelect = (count($categoryArray) > 2000) ? : false;

if ($multiSelect) {
    ?>
    <div class="span6 linked-categories" data-gx-controller="product/add_category_to_product">
        <div class="grid control-group remove-border">
            <div class="span6">
                <label><?php echo TEXT_CATEGORY_LINK; ?></label>
            </div>
            <div class="span6">
                <input type="hidden" name="main_category_id" value="<?php echo $pInfo->main_category_id; ?>">
                <select name="categories[]" class="full-width" multiple>
                    <?php
                    foreach ($categoryArray as $category) {
                        $selected = (in_array($category['id'], $categoryIds)) ? ' selected' : null;
                        echo '<option value="' . $category['id'] . '"' . $selected . '>'
                             . htmlentities_wrapper(html_entity_decode_wrapper($category['text'])) . '</option>';
                    }
                    ?>
                </select>
            </div>
        </div>
    </div>
    <div class="span6 linked-categories">
        <div class="grid control-group remove-border">
            <?php foreach ($categoryIds as $i => $categoryId): ?>
                <?php
                if ($categoryId === 0) {
                    continue;
                }
                ?>
                <div class="span12 multi-select-container">
                    <label class="category-path">
                        <?php
                        $categoryPathArray = xtc_generate_category_path($categoryId);
                        $categoryPathArray = array_reverse($categoryPathArray[0]);
                        
                        $categoryTexts = [];
                        foreach ($categoryPathArray as $categoryData) {
                            $categoryTexts[] = $categoryData['text'];
                        }
                        echo implode(' > ', $categoryTexts);
                        ?>
                    </label>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
} else {
    ?>
    
    <!--
        LINKED CATEGORIES
    -->
    <div class="span12 linked-categories" data-gx-controller="product/add_category_to_product">
        <div class="grid control-group">
            <div class="span2"><label><b><?php echo TEXT_CATEGORY_ASSIGN; ?></b></label></div>
            <div class="span3">&nbsp;</div>
            <div class="span6"><label><b><?php echo TEXT_CATEGORY_PATH; ?></b></label></div>
            <div class="span1"><b><?php echo TEXT_MAIN_CATEGORY; ?></b></
            >
        </div>
    </div>
    <div data-gx-widget="switcher" data-switcher-selector="input:radio">
        
        <?php
        $countCategories = count($categoryIds);
        
        foreach ($categoryIds as $i => $categoryId) {
            $checked = false;
            
            if ($i === 1) {
                array_unshift($categoryArray, ['id' => -1, 'text' => TEXT_NONE]);
            }
            
            $removeBorder = ($i === $countCategories) ? ' remove-border' : '';
            ?>
            <div class="grid control-group category-link-wrapper saved-category<?php echo $removeBorder; ?>">
                <div class="span2">
                    <label><?php echo TEXT_CATEGORY_LINK; ?></label>
                </div>
                <div class="span3 input-group">
                    <select name="categories[]" class="form-control">
                        <?php
                        foreach ($categoryArray as $category) {
                            $selected = ((int)$category['id'] === (int)$categoryId) ? ' selected' : null;
                            
                            echo '<option' . $selected . ' value="' . $category['id'] . '">'
                                 . htmlentities_wrapper(html_entity_decode_wrapper($category['text'])) . '</option>';
                        }
                        ?>
                    </select>
                </div>
                
                <div class="span6">
                    <label class="category-path">
                        <?php
                        $categoryPathArray = xtc_generate_category_path($categoryId);
                        $categoryPathArray = array_reverse($categoryPathArray[0]);
                        
                        $categoryTexts = [];
                        foreach ($categoryPathArray as $categoryData) {
                            if (is_array($categoryData)) {
                                $categoryTexts[] = htmlspecialchars($categoryData['text']);
                            }
                        }
                        
                        echo implode(' > ', $categoryTexts);
                        ?>
                    </label>
                </div>
                <div class="span1">
                    <?php
                    if ($categoryId !== 0) {
                        $checked = $countCategories === 1 || $i === 1;
                        ?>
                        
                        <input type="radio" title="<?php echo TEXT_SET_MAIN_CATEGORY; ?>" name="main_category_id"
                               value="<?php echo $categoryId; ?>"
                            <?php
                            if (((int)($pInfo->main_category_id ?? null) === (int)$categoryId)
                                || (empty($pInfo->main_category_id ?? null) && $checked)) {
                                echo "checked";
                            }
                            ?>
                        />
                        <?php
                    }
                    ?>
                </div>
            </div>
            <?php
        }
        
        ?>
    </div>
    <div class="grid control-group remove-border category-template hidden" data-switcher-selector="input:radio">
        <div class="span2">
            <label><?php echo TEXT_CATEGORY_LINK; ?></label>
        </div>
        <div class="span3">
            <?php
            
            if ($countCategories === 0) {
                array_unshift($categoryArray, ['id' => -1, 'text' => TEXT_NONE]);
            }
            
            echo xtc_draw_pull_down_menu('categories[]',
                                         $categoryArray,
                                         -1,
                                         'class="full-width" disabled'); ?>
        </div>
        <div class="span6">
            <label class="category-path"></label>
        </div>
        <div class="span1">
            <input type="radio" title="<?php echo TEXT_SET_MAIN_CATEGORY; ?>" name="main_category_id" value="-"
                   disabled/>
        </div>
    </div>
    
    <?php if (!$multiSelect): ?>
        <button type="button" class="btn add-category"><?php echo BUTTON_ADD ?></button>
    <?php endif; ?>
    </div>
    <?php
}
?>
