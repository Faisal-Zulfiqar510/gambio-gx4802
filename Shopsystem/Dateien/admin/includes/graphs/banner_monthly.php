<?php
/* --------------------------------------------------------------
  banner_monthly.php 2023-01-25
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2023 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.		
  --------------------------------------------------------------

  based on:
  (c) 2000-2001 The Exchange Project  (earlier name of osCommerce)
  (c) 2002-2003 osCommerce(banner_monthly.php,v 1.3 2002/05/09); www.oscommerce.com
  (c) 2003	 nextcommerce (banner_monthly.php,v 1.6 2003/08/18); www.nextcommerce.org
  (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: banner_monthly.php 899 2005-04-29 02:40:57Z hhgag $)

  Released under the GNU General Public License
  -------------------------------------------------------------- */

$year = (($_GET['year']) ? $_GET['year'] : date('Y'));

$stats = array();
for($i = 1; $i < 13; $i++)
{
    if (extension_loaded('intl')) {
        $monthName = DateFormatter::formatAsFullMonth(DateTime::createFromFormat('n',
                                                                                 $i),
                                                      new LanguageCode(new StringType($_SESSION['language_code'])));
        
        $stats[] = [$monthName, '0', '0'];
    } else {
        $stats[] = [date('F', mktime(0, 0, 0, $i)), '0', '0'];
    }
}

$banner_stats_query = xtc_db_query("select month(banners_history_date) as banner_month, sum(banners_shown) as value, sum(banners_clicked) as dvalue from " . TABLE_BANNERS_HISTORY . " where banners_id = '" . $banner_id . "' and year(banners_history_date) = '" . $year . "' group by banner_month");
while($banner_stats = xtc_db_fetch_array($banner_stats_query))
{
    if (extension_loaded('intl')) {
        $monthName = DateFormatter::formatAsFullMonth(DateTime::createFromFormat('n',
                                                                                 $banner_stats['banner_month']),
                                                      new LanguageCode(new StringType($_SESSION['language_code'])));
    } else {
        $monthName = date('F', mktime(0, 0, 0, $banner_stats['banner_month']));
    }
    
    $stats[($banner_stats['banner_month'] - 1)] = [
        $monthName,
        $banner_stats['value'] ?: '0',
        $banner_stats['dvalue'] ?: '0',
    ];
}

$graph = new PHPlot(600, 350, DIR_FS_CATALOG . 'cache/banner_monthly-' . $banner_id . '-' . LogControl::get_secure_token() . '.' . $banner_extension);

$graph->SetFileFormat($banner_extension);
$graph->SetIsInline(1);
$graph->SetPrintImage(0);

$graph->SetSkipBottomTick(1);
$graph->SetDrawYGrid(1);
$graph->SetPrecisionY(0);
$graph->SetPlotType('lines');

$graph->SetPlotBorderType('left');
$graph->SetTitle(mb_convert_encoding(sprintf(TEXT_BANNERS_MONTHLY_STATISTICS, $banner['banners_title'], $year), 'ISO-8859-1', 'UTF-8'));

$graph->SetBackgroundColor('white');

$graph->SetVertTickPosition('plotleft');
$graph->SetDataValues($stats);
$graph->SetDataColors(array('blue', 'red'), array('blue', 'red'));

$graph->DrawGraph();

$graph->PrintImage();