<?php
/* --------------------------------------------------------------
   GMOrderFormat.php 2023-01-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------

*	-> class to create a google sitemap
	*/
	class GMOrderFormat_ORIGIN {
		
		/*
		*	-> type: invoice or packingslip
		*/
		var $type;
		
		protected $db;


		/*
		*	-> constructor
		*/
		function __construct() {
			$this->db = StaticGXCoreLoader::getDatabaseQueryBuilder();
		}

		function ensure_next_invoice_id_is_free() {
			$next_id = $this->get_next_id('GM_NEXT_INVOICE_ID');
			
			if(!$this->is_id_free($next_id, 'invoice')) {
				$next_id = $this->get_next_free_id('invoice');
				$this->set_next_id('GM_NEXT_INVOICE_ID', $next_id);
			}
		}
		
		function get_next_id($type) {
			
			return gm_get_conf($type, 'ASSOC', true);
		}
		
		function is_id_free($id, $type) {
			$query  = 'SELECT COUNT(*) AS cnt 
						FROM `documents_index` 
						WHERE 
							`number` = ' . (int)$id . ' AND 
							`type` = "' . xtc_db_input($type) . '"';
			$result = xtc_db_query($query);
			$row    = xtc_db_fetch_array($result);
			
			return $row['cnt'] === '0';
		}
		
		function set_next_id($type, $next_id)
		{
			if(is_numeric($next_id) && $next_id >= $this->get_next_free_id($type))
			{
				$documentType = 'invoice';
				
				if($type == 'GM_NEXT_PACKINGS_ID')
				{
					$documentType = 'packing_slip';
				}
				
				$result = $this->db->where('number', $next_id)->where('type', $documentType)->get('documents_index')->num_rows();
				
				if($result === 0)
				{
					gm_set_conf($type, $next_id);
					
					return true;
				}
			}
			
			return false;
		}
		
		public function get_next_free_id($type)
		{
			$next_id = reset($this->db->select_max('number')
			                          ->where('type', $type)
			                          ->get('documents_index')
			                          ->result_array());
			
			$next_id = $next_id['number'] + 1;
			
			return $next_id;
		}
		
		
		public function get_next_gap($type)
		{
			$query  = 'SELECT (`number`+1) AS `free_id` 
						FROM `documents_index` 
						WHERE 
							`type` = "'  . xtc_db_input((string)$type) . '" AND 
							(`number`+1) NOT IN (
								SELECT `number` 
								FROM `documents_index` 
								WHERE `type` = "'  . xtc_db_input((string)$type) . '"
							) 
						ORDER BY `number`
						LIMIT 1';
			$result = xtc_db_query($query);
			if(xtc_db_num_rows($result))
			{
				$row = xtc_db_fetch_array($result);
				if($row['free_id'] != $this->get_next_free_id($type))
				{
					return (int)$row['free_id'];
				}
			}
			
			return false;
		}
		
		
		public function save_id($type, $id, $identifier)
		{
			return $this->db->insert('documents_index',
			                         ['number' => $id, 'type' => $type, 'identifier' => $identifier]);
		}
		
		
		public function delete_id($type, $identifier)
		{
			return $this->db->delete('documents_index', ['identifier' => $identifier, 'type' => $type]);
		}

		/*
		*	function to change the order status
		*	@param int		$p_orders_id
		*	@param int		$p_order_status_id
		*	@param int		$p_customer_notified
		*	@param String	$p_comment
		*	@param int		$p_customer_id
		*	@return void
		*/
		function update_orders_status($p_orders_id, $p_order_status_id, $p_customer_notified, $p_comment, $p_customer_id = null)
		{
			if(!empty($p_order_status_id))
			{
				xtc_db_query("
								UPDATE " .
									TABLE_ORDERS . "
								SET
									orders_status	= '" . (int)$p_order_status_id	. "',
									last_modified	= NOW()
								WHERE
									orders_id		= '" . (int)$p_orders_id		. "'
				");

				xtc_db_query("
								INSERT INTO " . 
									TABLE_ORDERS_STATUS_HISTORY . " 
								SET
									orders_id			= '" . (int)$p_orders_id		. "',
									orders_status_id	= '" . (int)$p_order_status_id	. "',
									customer_notified	= '" . (int)$p_customer_notified. "',
									comments			= '" . xtc_db_input($p_comment)	. "',
									date_added			= '" . date('Y-m-d H:i:s') . "',
									customer_id			= '" . (($p_customer_id !== null)? (int)$p_customer_id : 0) . "'"
				);
			}
			return;
		}


		/*
		*	function to get the date of the invoice
		*	@param int		$p_orders_id
		*	@param int		$p_order_status_id
		*	@return String
		*/
		function get_invoice_date($p_orders_id, $p_order_status_id)
		{
			$t_invoice_date =  date('d.m.Y');
			
			if(!empty($p_order_status_id))
			{
				$t_query = xtc_db_query("
											SELECT
												date_added
											FROM " . 
												TABLE_ORDERS_STATUS_HISTORY . " 
											WHERE
												orders_id			= '" . (int)$p_orders_id		. "'
											AND
												orders_status_id	= '" . (int)$p_order_status_id	. "'
											ORDER BY 
												date_added ASC
											LIMIT 1
				");

				if((int)xtc_db_num_rows($t_query) > 0)
				{
					$t_row = xtc_db_fetch_array($t_query);
					
					$t_invoice_date = xtc_date_short($t_row['date_added']);
				}
			}

			return $t_invoice_date;
		}
	}

MainFactory::load_origin_class('GMOrderFormat');
