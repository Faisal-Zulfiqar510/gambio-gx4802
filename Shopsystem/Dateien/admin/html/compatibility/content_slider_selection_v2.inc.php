<?php
/* --------------------------------------------------------------
   content_slider_selection_v2.inc.php 2016-11-02
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2016 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * This file is included in admin/content_manager.php
 */

function generateContentSliderSelect($group_id)
{
	global $sliderArray;
	global $sliderReadService;
	
	$t_content_slider_id = $sliderReadService->findAssignedSliderIdForContentId(new IdType((int)$group_id));
	
	$html               = '';
	$t_text_select_none = TEXT_SELECT_NONE;
	
	if(strpos($p_param_name, 'index') > 0)
	{
		$t_text_select_none = TEXT_SELECT_NONE_INDEX;
	}
	
	$html .= '<select name="content_slider" size="1">' . "";
	$html .= '<option value="0">' . $t_text_select_none . '</option>' . "<br>\n";
	
	/** @var SliderInterface $slider */
	foreach($sliderArray as $slider)
	{
		$t_mark = ($slider->getId() === $t_content_slider_id)
			? ' selected="selected"'
			: '';
		$html .= '<option value="' . $slider->getId() . '"' . $t_mark . '>' . $slider->getName() . '</option>'
		         . "<br>\n";
	}
	
	$html .= '</select>' . "";
	
	return $html;
}