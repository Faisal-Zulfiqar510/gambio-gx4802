/* ------------------------------------------------------------
 auto_updater_processed_v2.1.js 2018-12-04
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */


/**
 * AutoUpdater updates proceeded controller
 */
(function() {
	'use strict';
	
	/**
	 * Main container
	 *
	 * @type {Object}
	 */
	const $this = $('.auto-updater-updates-container');
	
	/**
	 * Modal objects
	 *
	 * @type {jQuery|HTMLElement}
	 */
	const $modal = $('div.db-backup.modal');
	
	/**
	 * Status flag for the backup creation status
	 *
	 * @type {boolean}
	 */
	let backupCreated = false;
	
	/**
	 * Status flag for the backup processing status
	 *
	 * @type {boolean}
	 */
	let backupDone = false;
	
	//
	// HANDLER FUNCTIONS
	//
	
	/**
	 * Click handler for the "start update processing" action
	 *
	 * @param {MessageEvent} event Triggered event.
	 */
	function showCreateBackupModal(event) {
		event.preventDefault();
		
		$modal.find('button.close-modal').hide();
		$modal.find('button.process-updates').addClass('pull-left');
		$modal.find('button.process-updates').removeClass('pull-right');
		$modal.find('button.process-updates').removeClass('btn-primary');
		$modal.find('button.process-updates').text(jse.core.lang.translate('button_skip_db_backup', 'auto_updater'));
		$modal.find('button.create-db-backup').show();
		$modal.find('button.create-db-backup').on('click', startDbBackupCreation);
		$modal.find('.progress').hide();
		$modal.find('.error').hide();
		$modal.modal({
			show: true,
			backdrop: "static",
			keyboard: false
		});
	}
	
	/**
	 * Handles the "create db backup" action
	 *
	 * @param {MessageEvent} event Triggered event.
	 */
	function startDbBackupCreation(event) {
		event.preventDefault();
		
		backupCreated = false;
		backupDone = false;
		
		$modal.find('.progress').show();
		$modal.find('button.process-updates').prop('disabled', true);
		$modal.find('button.create-db-backup').prop('disabled', true);
		
		initDbBackupCreation();
		setTimeout(startBackupCreationTimer, 1000);
	}
	
	//
	// HELPER FUNCTIONS
	//
	
	/**
	 * Starts the backup creation timer, which checks if the backup creation processing is done
	 */
	function startBackupCreationTimer() {
		if (backupDone === false) {
			setTimeout(startBackupCreationTimer, 1000);
			return;
		}
		
		$modal.find('button.close-modal').show();
		$modal.find('button.create-db-backup').hide();
		$modal.find('button.create-db-backup').prop('disabled', false);
		$modal.find('button.process-updates').prop('disabled', false);
		$modal.find('button.process-updates').removeClass('pull-left');
		$modal.find('button.process-updates').addClass('pull-right');
		$modal.find('button.process-updates').addClass('btn-primary');
		$modal.find('button.process-updates')
			.text(jse.core.lang.translate('button_start_update_processing', 'auto_updater'));
	}
	
	/**
	 * Updates the progress bar
	 *
	 * @param {number} progress  Current progress in percent.
	 * @param {boolean} canceled  True, if the job was canceled.
	 */
	function _updateProgressBar(progress, canceled = false) {
		const $progressBar = $modal.find('.progress .progress-bar');
		
		if (!Number.isInteger(progress) || progress < 0) {
			progress = 0;
		} else if (progress > 100) {
			progress = 100;
		}
		
		$progressBar.prop('aria-valuenow', progress);
		$progressBar.css('width', progress + '%');
		$progressBar.text(progress + '%');
		
		if (canceled) {
			$progressBar.removeClass('active');
			$progressBar.addClass('progress-bar-danger');
			return;
		}
		
		$progressBar.removeClass('progress-bar-danger');
		$progressBar.addClass('active');
		if (progress === 100) {
			$progressBar.removeClass('active');
		}
	}
	
	
	/**
	 * Initiates the db backup creation
	 */
	function initDbBackupCreation() {
		$.ajax({
			type: "GET",
			url: "request_port.php?module=DBBackup&action=reset_db_backup&page_token="
				+ jse.core.config.get('pageToken'),
			timeout: 30000,
			context: this,
			success: function(p_response) {
				processDbBackupCreation();
			},
			error: function(p_jqXHR, p_exception) {
				initDbBackupCreation();
			}
		});
	}
	
	/**
	 * Proceeds the db backup creation
	 */
	function processDbBackupCreation() {
		$.ajax({
			type: "GET",
			url: "request_port.php?module=DBBackup&action=create_db_backup&page_token="
				+ jse.core.config.get('pageToken'),
			timeout: 30000,
			context: this,
			success: function(p_response) {
				if ($.type(p_response) == "object" && (p_response.status == "continue_backup" || p_response.status
					== "backup_done")) {
					_updateProgressBar(p_response.progress);
					if (p_response.status == "continue_backup") {
						processDbBackupCreation();
					}
					else if (p_response.status == "backup_done") {
						bundleDbBackup('zip');
					}
				}
				else {
					if ($.type(p_response) == "object") {
						var t_error = p_response.error_message;
						if ($.trim(t_error) == "") {
							t_error = "Unbekannter Fehler!";
						}
						resetDbBackupProcessing(t_error);
					}
					else {
						resetDbBackupProcessing(p_response);
					}
				}
				
			},
			error: function(p_jqXHR, p_exception) {
				resetDbBackupProcessing("Unbekannter Fehler!");
			}
		});
	}
	
	/**
	 * Proceeds the db backup bundling
	 *
	 * @param p_bundle_type
	 */
	function bundleDbBackup(p_bundle_type) {
		var c_bundle_type = $.trim(p_bundle_type);
		$.ajax({
			type: "GET",
			url: "request_port.php?module=DBBackup&action=bundle_db_backup&bundle_type=" + c_bundle_type
				+ "&page_token=" + jse.core.config.get('pageToken'),
			timeout: 30000,
			context: this,
			success: function(p_response) {
				if ($.type(p_response) != "object" || p_response.status == "error") {
					if (c_bundle_type == 'zip') {
						_updateProgressBar(97);
						bundleDbBackup('gzip');
					}
					else if (c_bundle_type == 'gzip') {
						_updateProgressBar(98);
						bundleDbBackup('sql');
					}
					else if (c_bundle_type == 'sql' && $.type(p_response) != "object") {
						resetDbBackupProcessing(p_response);
					}
					else if (c_bundle_type == 'sql' && $.type(p_response) == "object") {
						resetDbBackupProcessing(p_response.error_message);
					}
				}
				else if (p_response.status == "success") {
					_updateProgressBar(99);
					resetDbBackupProcessing();
				}
			},
			error: function(p_jqXHR, p_exception) {
				resetDbBackupProcessing("Unbekannter Fehler!");
			}
		});
	}
	
	/**
	 * Resets the db backup processing
	 *
	 * @param p_error
	 */
	function resetDbBackupProcessing(p_error) {
		var c_error = false;
		if ($.trim(p_error) != '' && $.trim(p_error) != 'false') {
			c_error = $.trim(p_error);
		}
		$.ajax({
			type: "GET",
			url: "request_port.php?module=DBBackup&action=reset_db_backup&page_token="
				+ jse.core.config.get('pageToken'),
			timeout: 30000,
			context: this,
			success: function(p_response) {
				if (c_error == false) {
					_updateProgressBar(100);
				}
				else {
					$modal.find('.error').show();
					_updateProgressBar(100, true);
				}
				
				backupCreated = c_error == false;
				backupDone = true;
			},
			error: function(p_jqXHR, p_exception) {
				resetDbBackupProcessing(c_error);
			}
		});
	}
	
	//
	// INITIALISATION
	//
	
	/**
	 * Handles the module initialization.
	 */
	function onInit() {
		$this.find('input.download-updates[type="submit"]').on('click', showCreateBackupModal);
	}
	
	document.addEventListener('DOMContentLoaded', onInit);
})();
