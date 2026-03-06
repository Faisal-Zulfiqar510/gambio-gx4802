<?php
/* --------------------------------------------------------------
   GMModuleManager.php 2022-08-03
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

use Gambio\Core\Logging\LoggerBuilder;

class GMModuleManager_ORIGIN
{
	public $v_module_type                 = '';
	public $v_modules_directory           = '';
	public $v_modules_lang_directory      = '';
	public $v_module_link                 = '';
	public $v_show_installed_modules_menu = false;
	public $v_display_installed_modules   = false;
	public $v_show_missing_modules_menu   = true;
	public $v_display_missing_modules     = true;
	public $v_coo_lang_file_master        = null;
	
	protected $incompatibleModulesCache = [];
	
	public function __construct($p_module_type,
	                            $p_show_installed_modules_menu = false,
	                            $p_display_installed_modules = false,
	                            $p_show_missing_modules_menu = true,
	                            $p_display_missing_modules = true,
	                            $p_ignore_files_array = array())
	{
		$this->v_module_type = basename($p_module_type);
		if($p_module_type == 'ordertotal')
		{
			$this->v_module_type = 'order_total';
		}
		$this->v_modules_directory           = DIR_FS_CATALOG_MODULES . $this->v_module_type . '/';
		$this->v_modules_lang_directory      = DIR_FS_LANGUAGES . $_SESSION['language'] . '/modules/'
		                                       . $this->v_module_type . '/';
		$this->v_module_link                 = FILENAME_MODULES . '?set=' . $this->v_module_type . '&module=';
		$this->v_show_installed_modules_menu = $p_show_installed_modules_menu;
		$this->v_display_installed_modules   = $p_display_installed_modules;
		$this->v_show_missing_modules_menu   = $p_show_missing_modules_menu;
		$this->v_display_missing_modules     = $p_display_missing_modules;
		$this->v_ignore_files_array          = $p_ignore_files_array;
		$this->v_coo_lang_file_master        = MainFactory::create_object('LanguageTextManager', array(), true);
	}
	
	
	public function get_modules_installed()
	{
		$t_modules_installed     = array();
		$t_get_modules_installed = xtc_db_query("SELECT `value`
													FROM `gx_configurations`
													WHERE `key` = 'configuration/MODULE_"
		                                        . strtoupper($this->v_module_type) . "_INSTALLED'
													LIMIT 1");
		if(xtc_db_num_rows($t_get_modules_installed) == 1)
		{
			$t_modules_installed_result                        = xtc_db_fetch_array($t_get_modules_installed);
			$t_modules_installed_result['value'] = str_replace('.php', '',
			                                                                 $t_modules_installed_result['value']);
			$t_modules_installed                               = explode(';',
			                                                             $t_modules_installed_result['value']);
		}
		
		return $t_modules_installed;
	}
	
	
	public function get_missing_modules($p_structure_array)
	{
		$t_missing_modules = array();
		
		if($t_dir = opendir($this->v_modules_directory))
		{
			while($t_file = readdir($t_dir))
			{
				if(substr($t_file, -4) == '.php')
				{
					if(strpos(serialize($p_structure_array), '"' . substr($t_file, 0, -4) . '"') === false
					   && !in_array($t_file, $this->v_ignore_files_array))
					{
						$t_missing_modules[] = substr($t_file, 0, -4);
					}
				}
			}
			
			sort($t_missing_modules);
			closedir($t_dir);
		}
		
		return $t_missing_modules;
	}
	
	
	public function repair()
	{
		$t_modules_installed_array = $this->get_modules_installed();
		
		if($t_dir = opendir($this->v_modules_directory))
		{
			while($t_file = readdir($t_dir))
			{
				if(substr($t_file, -4) == '.php')
				{
					$this->v_coo_lang_file_master->init_from_lang_file('lang/' . $_SESSION['language'] . '/modules/'
					                                                   . $this->v_module_type . '/' . $t_file);
					include_once($this->v_modules_directory . $t_file);
					
					$t_module_name = substr($t_file, 0, -4);
					
					if(xtc_class_exists($t_module_name))
					{
						$coo_module = new $t_module_name();
						$moduleCheck = $this->isActive($coo_module);
						
						if($moduleCheck && !in_array($coo_module->code, $t_modules_installed_array))
						{
							$t_modules_installed_array[] = $coo_module->code;
							
							foreach($t_modules_installed_array AS $t_key => $t_value)
							{
								if(substr($t_value, -4) != '.php')
								{
									$t_modules_installed_array[$t_key] .= '.php';
								}
								if($t_modules_installed_array[$t_key] == '.php')
								{
									unset($t_modules_installed_array[$t_key]);
								}
							}
							
							$t_modules_installed_array = array_unique($this->sort_modules($t_modules_installed_array));
							
							xtc_db_query("UPDATE `gx_configurations`
										 SET `value` = '" . xtc_db_input(implode(';',
							                                                                 $t_modules_installed_array))
							             . "'
										 WHERE `key` = 'configuration/MODULE_" . strtoupper($this->v_module_type)
							             . "_INSTALLED'");
						}
						elseif(!$moduleCheck && in_array($coo_module->code, $t_modules_installed_array))
						{
							foreach($t_modules_installed_array AS $t_key => $t_value)
							{
								if($t_value == $coo_module->code || empty($t_value))
								{
									unset($t_modules_installed_array[$t_key]);
                                } elseif (substr($t_value, -4) != '.php') {
                                    $t_modules_installed_array[$t_key] .= '.php';
                                }
							}
							
							$t_modules_installed_array = array_unique($this->sort_modules($t_modules_installed_array));
							
							xtc_db_query("UPDATE `gx_configurations`
										 SET `value` = '" . xtc_db_input(implode(';',
							                                                                 $t_modules_installed_array))
							             . "'
										 WHERE `key` = 'configuration/MODULE_" . strtoupper($this->v_module_type)
							             . "_INSTALLED'");
						}
					}
				}
			}
			
			closedir($t_dir);
		}
	}
	
	
	public function sort_modules($p_modules_array)
	{
		$t_sorted_modules_array      = array();
		$t_modules_files_array       = array();
		$t_modules_sort_number_array = array();
		
		foreach($p_modules_array AS $t_key => $t_file)
		{
			if(substr($t_file, -4) != '.php')
			{
				$t_file .= '.php';
			}
			
			if(is_file($this->v_modules_directory . $t_file))
			{
				$this->v_coo_lang_file_master->init_from_lang_file('lang/' . $_SESSION['language'] . '/modules/'
				                                                   . $this->v_module_type . '/' . $t_file);
				include_once($this->v_modules_directory . $t_file);
				
				$t_module_name = substr($t_file, 0, -4);
				if(xtc_class_exists($t_module_name))
				{
					$coo_module = new $t_module_name();
                    $moduleCheck = $this->isActive($coo_module);
					
					if($moduleCheck)
					{
                        $t_module_name = strpos($t_module_name, 'ot_') === 0 ? substr($t_module_name, 3) : $t_module_name;
						if(isset($_POST['configuration']['configuration/MODULE_' . strtoupper($this->v_module_type) . '_'
						                                 . strtoupper($t_module_name) . '_SORT_ORDER']))
						{
							$t_modules_sort_number_array[] = $_POST['configuration']['configuration/MODULE_'
							                                                         . strtoupper($this->v_module_type)
							                                                         . '_' . strtoupper($t_module_name)
							                                                         . '_SORT_ORDER'];
						}
						elseif (property_exists($coo_module, 'sort_order')) {
                            $t_modules_sort_number_array[] = $coo_module->sort_order;
                        } else {
                            $t_modules_sort_number_array[] = 0;
                        }
						$t_modules_files_array[] = $t_file;
					}
				}
			}
		}
		
		asort($t_modules_sort_number_array);
		reset($t_modules_sort_number_array);
		
		foreach($t_modules_sort_number_array AS $t_key => $t_value)
		{
			$t_sorted_modules_array[] = $t_modules_files_array[$t_key];
		}
		
		return $t_sorted_modules_array;
	}
	
	
	public function save_sort_order($p_modules_array)
	{
		$t_modules_array = array_unique($this->sort_modules($p_modules_array));
		xtc_db_query("UPDATE `gx_configurations`
							 SET `value` = '" . xtc_db_input(implode(';', $t_modules_array)) . "'
							 WHERE `key` = 'configuration/MODULE_" . strtoupper($this->v_module_type) . "_INSTALLED'");
	}
	
	
	public function get_module_data_by_name($p_module_name)
	{
		$t_module_data = array();
		
		if(file_exists($this->v_modules_directory . basename($p_module_name) . '.php'))
		{
			$this->v_coo_lang_file_master->init_from_lang_file('lang/' . $_SESSION['language'] . '/modules/'
			                                                   . $this->v_module_type . '/' . basename($p_module_name)
			                                                   . '.php');
			include_once($this->v_modules_directory . basename($p_module_name) . '.php');
			
			if(xtc_class_exists($p_module_name))
			{
				$coo_module = new $p_module_name();
                $moduleCheck = $this->isActive($coo_module);
				
				$t_module_keys_array = array();
				$t_keys_array        = $coo_module->keys();
				
				for($i = 0, $count = count($t_keys_array); $i < $count; $i++)
				{
					$t_get_key_data = xtc_db_query("SELECT
														`key`,
														`value`,
														`type`
													FROM `gx_configurations`
													WHERE
														`key` = '" . $t_keys_array[$i] . "'
													LIMIT 1");
					if(xtc_db_num_rows($t_get_key_data) == 1)
					{
						$t_key_data                                             = xtc_db_fetch_array($t_get_key_data);
						$unPrefixedKey = str_replace('configuration/', '', $t_keys_array[$i]);
						
						$t_module_keys_array[$unPrefixedKey]['title']        = (defined(strtoupper($unPrefixedKey
						                                                                              . '_TITLE'))) ? constant(strtoupper($unPrefixedKey
						                                                                                                                  . '_TITLE')) : '';
						$t_module_keys_array[$unPrefixedKey]['value']        = $t_key_data['value'];
						$t_module_keys_array[$unPrefixedKey]['description']  = (defined(strtoupper($unPrefixedKey
						                                                                              . '_DESC'))) ? constant(strtoupper($unPrefixedKey
						                                                                                                                 . '_DESC')) : '';
						$t_module_keys_array[$unPrefixedKey]['type'] = $t_key_data['type'];
					}
				}
				
				$t_module_data = array(
					'code'         => $coo_module->code,
					'title'        => $coo_module->title,
					'description'  => $coo_module->description,
					'show_install' => isset($coo_module->show_install) ? $coo_module->show_install : null,
					'sort_order'   => ($moduleCheck
					                   && property_exists($coo_module, 'sort_order') ? (is_numeric($coo_module->sort_order) ? $coo_module->sort_order : '') : ''),
					'arrow'        => (!empty($_GET['module']) && $_GET['module'] !== $coo_module->code) ? '<a href="' . $this->v_module_link
					                                                           . $coo_module->code
					                                                           . '" id="gm_module_arrow_inactive_'
					                                                           . $coo_module->code . '"><img src="'
					                                                           . DIR_WS_ADMIN
					                                                           . 'html/assets/images/legacy/icon_info.gif" title="'
					                                                           . htmlspecialchars_wrapper($coo_module->title)
					                                                           . '" /></a>' : '<img src="'
					                                                                          . DIR_WS_ADMIN
					                                                                          . 'html/assets/images/legacy/icon_arrow_right.gif" title="'
					                                                                          . htmlspecialchars_wrapper($coo_module->title)
					                                                                          . '" id="gm_module_arrow_active_'
					                                                                          . $coo_module->code
					                                                                          . '" />',
					'status'       => $moduleCheck,
                    'enabled'      => ($coo_module->enabled ?? false),
					'keys'         => $t_module_keys_array,
					'icon'         => isset($coo_module->icon) ? $coo_module->icon : '',
				);
			}
		}
		
		return $t_module_data;
	}
	
	
	public function show_modules($p_structure_array)
	{
		$t_structure_array = $p_structure_array;
		
		if($this->v_show_missing_modules_menu)
		{
			$t_missing_modules_array = array(
				array(
					'TITLE'   => GM_MODULES_MISSING_TITLE,
					'MODULES' => $this->get_missing_modules($t_structure_array),
					'DISPLAY' => $this->v_display_missing_modules
				)
			);
			if(!empty($t_missing_modules_array[0]['MODULES'][0]))
			{
				$t_structure_array = array_merge($t_structure_array, $t_missing_modules_array);
			}
		}
		
		if(isset($_GET['module']))
		{
			foreach($t_structure_array AS $t_key => $t_value)
			{
				$t_structure_array[$t_key] = $this->expand_menu($t_value, $_GET['module']);
			}
		}
		
		$this->draw_output($t_structure_array);
	}
	
	
	public function expand_menu($p_structure_array, $p_module)
	{
		if(isset($p_structure_array['MODULES']) && is_array($p_structure_array['MODULES']))
		{
			foreach($p_structure_array['MODULES'] AS $t_index => $t_module)
			{
				if($t_module == $p_module)
				{
					$p_structure_array['DISPLAY'] = 1;
					
					return $p_structure_array;
				}
				elseif(is_array($t_module))
				{
					$t_result = $this->expand_menu($t_module, $p_module);
					if(is_array($t_result))
					{
						$p_structure_array['MODULES'][$t_index] = $t_result;
						$p_structure_array['DISPLAY']           = 1;
					}
				}
			}
		}
		
		return $p_structure_array;
	}
	
	
	public function draw_output($structure)
	{
		foreach($structure as $module)
		{
			if(!is_array($module))
			{
				$this->draw_module($module);
			}
			else
			{
				if(isset($module['GHOST']) && $module['GHOST'] == true && !isset($_GET['showghosts']))
				{
					continue;
				}
				
				if(isset($module['MODULES']))
				{
					if($this->is_empty($module['MODULES']))
					{
						continue;
					}
					
					if(isset($module['TITLE']) && (!isset($module['DISPLAY']) || $module['DISPLAY']))
					{
						$this->draw_head_row($module['MODULES'], $module['TITLE']);
					}
					
					$hidden = !$this->is_any_module_installed_or_selected($module['MODULES']);
					
					foreach($module['MODULES'] as $singleModule)
					{
						$this->draw_module($singleModule, true, $hidden, ' id_' . md5(serialize($module['MODULES'])));
					}
				}
			}
		}
	}
	
	
	public function draw_module($p_module, $nested = false, $hidden = false, $p_class = '')
	{
		$moduleData = $this->get_module_data_by_name($p_module);
		
		if(!empty($moduleData))
		{
			$classes = '';
			if(!empty($_GET['module']) && $_GET['module'] === $moduleData['code'])
			{
				$classes = 'active';
			}
			
			if($nested)
			{
				$classes .= ' nested';
			}
			
			if(isset($moduleData['sort_order']) && $moduleData['sort_order'] !== '')
			{
				$classes .= ' installed';
			}
			
			if($hidden)
			{
				$classes .= ' hidden';
			}
			
			if($p_class !== '')
			{
				$classes .= ' ' . $p_class;
			}

			$logo = '';
			$name = $moduleData['title'];
			if($_GET['set'] === 'payment')
			{
				preg_match('/(<img[^>]+?>)/', $moduleData['title'], $matches);
				$logo = isset($matches[1]) ? $matches[1] : '';
				$logo = preg_replace('/(style="[^"]*")/', '', $logo);
				$logo = preg_replace('/(class="[^"]*")/', '', $logo);
				$name = trim(preg_replace('/(<[^>]+?>)/', '', $moduleData['title']));
				if(empty($logo))
				{
					$logoFile = 'default.png';
					$logoExtensions = ['.svg', '.png', '.gif', '.jpg'];
					$languageExtensions = [strtolower($_SESSION['language_code']), ''];
					foreach($languageExtensions as $languageExtension)
					{
						$languageExtension = empty($languageExtension) ? $languageExtension : '_' . $languageExtension;
						foreach($logoExtensions as $extension)
						{
							$logoFileCandidate = $moduleData['code'] . $languageExtension . $extension;
							if(file_exists(DIR_FS_CATALOG . 'images/icons/payment/' . $logoFileCandidate))
							{
								$logoFile = $logoFileCandidate;
								break 2;
							}
						}
					}
					
					$logo = sprintf('<img src="%s" alt="%s">',
					                xtc_catalog_href_link('images/icons/payment/' . $logoFile, '', 'SSL', false, false, false, true, true),
					                $name
					);
				}
			}
			if($_GET['set'] === 'shipping')
			{
				if(!empty($moduleData['icon']))
				{
					$icon = $moduleData['icon'];
				}
				else
				{
					$logoFile = 'default.png';
					$logoExtensions = ['.svg', '.png', '.gif', '.jpg'];
					$languageExtensions = [strtolower($_SESSION['language_code']), ''];
					foreach($languageExtensions as $languageExtension)
					{
						$languageExtension = empty($languageExtension) ? $languageExtension : '_' . $languageExtension;
						foreach($logoExtensions as $extension)
						{
							$logoFileCandidate = $moduleData['code'] . $languageExtension . $extension;
							if(file_exists(DIR_FS_CATALOG . 'images/icons/shipping/' . $logoFileCandidate))
							{
								$logoFile = $logoFileCandidate;
								break 2;
							}
						}
					}
					$icon = 'images/icons/shipping/' . $logoFile;
				}
				
				$logo = sprintf('<img src="%s" alt="%s">',
				                xtc_catalog_href_link($icon, '', 'SSL', false, false, false, true, true),
				                $name
				);
			}

			$isActive = $moduleData['enabled'];
			echo $this->draw_row($name, $logo, $moduleData['code'], $moduleData['sort_order'], $classes, '', $isActive);
		}
	}
	
	
	public function draw_row($p_name, $p_logo, $p_moduleName, $p_sort, $p_class = '', $p_id = '', $p_active = '')
	{
		$id   = '';
		$icon = '';
		if($p_id !== '')
		{
			$id   = ' id="' . $p_id . '"';
			$type = strpos($p_class, 'closed') !== false ? 'plus' : 'minus';
			$icon = '<span class="collapse-icon">
						<i class="fa fa-' . $type . '-square-o"></i>
					</span>';
		}
		
		$installedBadge = '';
		if($p_sort !== '')
		{
            $class = 'badge ';
            switch ($p_active) {
                case 'True':
                case 'true':
                    $class .= 'badge-success';
                    $status = 'active';
                    break;
                default:
                    $status = 'inactive';
                    break;
            }
            $installedBadge = '<span class="' . $class . '">'
                . $this->v_coo_lang_file_master->get_text($status, 'buttons') . '</span> ';
		}
		
		if(strpos($p_class, 'nested') !== false)
		{
			$p_name = '<i class="fa fa-angle-right"></i> ' . $p_name;
		}
		
		$linkComponent = '';
		if($p_moduleName !== '')
		{
			$linkComponent = ' data-gx-extension="link" data-link-url="' . xtc_href_link(FILENAME_MODULES,
			                                                                             xtc_get_all_get_params(array(
				                                                                                                    'module',
				                                                                                                    'action'
			                                                                                                    ))
			                                                                             . 'module=' . $p_moduleName)
			                 . '"';
		}
		
		echo '<tr class="dataTableRow ' . $p_class . '"' . $id . $linkComponent . '>
					<td class="dataTableContent">' . $icon . '</td>
					<td class="dataTableContent">' . $p_name . '</td>
					<td class="dataTableContent">' . $p_logo . '</td>
					<td class="dataTableContent">' . $p_moduleName . '</td>
					<td class="dataTableContent">' . $installedBadge . '</td>
					<td class="dataTableContent numeric_cell">' . $p_sort . '</td>
					<td class="dataTableContent"></td>
				</tr>';
	}
	
	
	public function draw_head_row(array $modules, $p_title, $p_logo = '')
	{
		$class = 'module-head';
		if(!$this->is_any_module_installed_or_selected($modules))
		{
			$class = 'module-head closed';
		}
		
		$this->draw_row($p_title, $p_logo, '', '', $class, 'id_' . md5(serialize($modules)));
	}
	
	
	public function is_any_module_installed_or_selected(array $modules)
	{
		foreach($modules as $module)
		{
			$moduleData = $this->get_module_data_by_name($module);

            if ((isset($moduleData['sort_order']) && $moduleData['sort_order'] !== '')
                || (isset($_GET['module'])
                    && $_GET['module'] === $module)) {
				return true;
			}
		}
		
		return false;
	}
	
	
	public function is_empty(array $modules)
	{
		foreach($modules as $module)
		{
			$moduleData = $this->get_module_data_by_name($module);
			
			if(!empty($moduleData))
			{
				return false;
			}
		}
		
		return true;
	}
    
    
    private function isActive(object $module): bool
    {
        if (!method_exists($module, 'check')) {
            return false;
        }
        
        try {
            return $module->check();
        } catch (\Exception $e) {
            $className = get_class($module);
            $type      = $_GET['set'] ?? 'unknown';
            if (!in_array($className, $this->incompatibleModulesCache, true)) {
                $this->incompatibleModulesCache[] = $className;
                
                /** @var LoggerBuilder $loggerBuilder */
                $loggerBuilder = LegacyDependencyContainer::getInstance()->get(LoggerBuilder::class);
                $loggerBuilder->changeNamespace("incompatible_{$type}_modules")
                    ->addRequestData()
                    ->build()
                    ->warning('Incompatible module',
                              ['type' => $type, 'module' => $className, 'message' => $e->getMessage()]);
            }
            
            return false;
        }
    }
}

MainFactory::load_origin_class('GMModuleManager');
