/* --------------------------------------------------------------
 adwords_overview_columns.js 2017-11-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.adwords_overview_columns = jse.libs.adwords_overview_columns || {};

/**
 * ## Adwords Table Column Definitions
 *
 * This module defines the column definition of the adwords overview table. They can be overridden by other
 * scripts by modifying the array with new columns, or by replacing the property values of the contained
 * fields.
 *
 * @module Admin/Libs/adwords_overview_columns
 * @exports jse.libs.adwords_overview_columns
 */
(function (exports) {

    'use strict';

    exports.status = exports.status || {
        data: 'status',
        minWidth: '100px',
        widthFactor: 1,
        className: 'status',
        searchable: false,
        render(data, type, full, meta) {
            return `<input type="checkbox" ${(data ? "checked" : "")} class="campaign-status-checkbox" data-id="${full.DT_RowData.id}" />`
        }
    };

    exports.name = exports.name || {
        data: 'name',
        minWidth: '150px',
        widthFactor: 1,
        render(data, type, full, meta) {
            return `<span title="${full.name}">${data}</span>`
        }
    };

    exports.dailyBudget = exports.dailyBudget || {
        data: 'dailyBudget',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render(data, type, full, meta) {
            return `<span title="${full.dailyBudget}" data-budget="${full.DT_RowData.dailyBudget}" data-budget-html="${data}" data-id="${full.DT_RowData.id}" class="daily-budget">${data}</span>`
        }
    };

    exports.clicks = exports.clicks || {
        data: 'clicks',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render(data, type, full, meta) {
            return `<span title="${full.clicks}">${data}</span>`
        }
    };

    exports.impressions = exports.impressions || {
        data: 'impressions',
        minWidth: '125px',
        widthFactor: 1,
        className: 'numeric',
        render(data, type, full, meta) {
            return `<span title="${full.impressions}">${data}</span>`
        }
    };

    exports.clickThroughRate = exports.clickThroughRate || {
        data: 'clickThroughRate',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render(data, type, full, meta) {
            return `<span title="${full.clickThroughRate}">${data}</span>`
        }
    };

    exports.costPerClick = exports.costPerClick || {
        data: 'costPerClick',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render(data, type, full, meta) {
            return `<span title="${full.costPerClick}">${data}</span>`
        }
    };

    exports.costs = exports.costs || {
        data: 'costs',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render(data, type, full, meta) {
            return `<span title="${full.costs}">${data}</span>`
        }
    };

    exports.actions = exports.actions || {
        data: null,
        minWidth: '350px',
        widthFactor: 1,
        className: 'actions',
        orderable: false,
        searchable: false,
        render(data, type, full, meta) {
            return `					
					<div class="pull-left"></div>
					<div class="pull-right action-list visible-on-hover">
						<i class="fa fa-pencil row-edit" title="${jse.core.lang.translate('edit', 'buttons')}"></i>
						<button type="button"
								class="btn btn-default btn-save"></button>
						<button type="button"
								class="btn btn-default btn-cancel"></button>
					</div>
				`;
        }
    };
})(jse.libs.adwords_overview_columns); 