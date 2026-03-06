<?php
/* --------------------------------------------------------------
   category_slider_selection.inc.php 2016-11-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2016 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * This file is included in admin/html/compatibility/new_category.php
 */


function generateCatSliderSelect($activeSliderId)
{
	global $sliderArray;
	
	$html               = '';
	$t_text_select_none = TEXT_SELECT_NONE;
	if(strpos($p_param_name, 'index') > 0)
	{
		$t_text_select_none = TEXT_SELECT_NONE_INDEX;
	}
	$html .= '<select name="cat_slider" size="1">' . "";
	$html .= '<option value="0">' . $t_text_select_none . '</option>' . "<br />\n";
	foreach($sliderArray as $f_key => $coo_slider)
	{
		$t_slider_set_id   = $coo_slider->v_slider_set_id;
		$t_slider_set_name = $coo_slider->v_slider_set_name;
		$t_mark            = ($t_slider_set_id == $activeSliderId)
			? ' selected="selected"'
			: '';
		$html .= '<option value="'
		         . $t_slider_set_id
		         . '"'
		         . $t_mark
		         . '>'
		         . $t_slider_set_name
		         . '</option>'
		         . "<br />\n";
	}
	$html .= '</select>' . "";
	
	return $html;
}