<?php
/* --------------------------------------------------------------
   fontawesome_fallback.php 2018-10-02
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2015 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

// For license conflict reasons there must be a FontAwesome fallback mode, so that 
// the shop works even if there are no font files for the icons. This script will check 
// if the font files are present and will output fallback CSS styling in case they are
// missing.

$fontAwesomeFonts = (array)glob(DIR_FS_ADMIN . 'html/assets/fonts/fontawesome-free/*.ttf');
$fontAwesomePresent = !empty($fontAwesomeFonts);

if(!$fontAwesomePresent)
{
	$fallbackCssStyling = '
		<!-- 
		    FONTAWESOME FALLBACK MODE IS ENABLED 
		 --> 
		<style>
			.fa::before {
				content: "o" !important;
			}
		</style>
	';
	
	echo $fallbackCssStyling;
}
