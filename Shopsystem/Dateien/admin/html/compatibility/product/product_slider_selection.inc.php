<?php
/* --------------------------------------------------------------
   product_slider_selection.inc.php 2016-11-02
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2016 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * This file is included in admin/html/compatibility/product/advanced_configuration.php
 */

function generateSliderInput($activeSliderId)
{
	global $sliderArray;
	
	$html = '<select name="product_slider">';
	$html .= '<option value="0">' . TEXT_SELECT_NONE . '</option>';
	
	foreach($sliderArray as $slider)
	{
		$sliderId   = $slider->v_slider_set_id;
		$sliderName = $slider->v_slider_set_name;
		$isSelected = ($sliderId === $activeSliderId);
		
		$html .= '<option value="' . $sliderId . '" ' . ($isSelected ? 'selected' : '') . '>' . $sliderName
		         . '</option>';
	}
	
	$html .= '</select>';
	
	return $html;
}