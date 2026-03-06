<?php
/* --------------------------------------------------------------
  google_shopping_default_fields.inc.php 2017-11-16
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2017 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------
*/

return [
    [
        'name'            => 'ID',
        'content'         => '{p_id}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 1,
        'status'          => 1
    ],
    [
        'name'            => 'Titel',
        'content'         => '{p_google_name_vpe_suffix|truncate:150:"..."}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 2,
        'status'          => 1
    ],
    [
        'name'            => 'Beschreibung',
        'content'         => '{p_description|truncate:5000:"..."}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 3,
        'status'          => 1
    ],
    [
        'name'            => 'Google Produktkategorie',
        'content'         => '{p_google_category|truncate:750:"..."}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 4,
        'status'          => 1
    ],
    [
        'name'            => 'Produkttyp',
        'content'         => '{c_path}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 5,
        'status'          => 1
    ],
    [
        'name'            => 'Link',
        'content'         => '{p_link}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 6,
        'status'          => 1
    ],
    [
        'name'            => 'Bildlink',
        'content'         => '{p_popup_image}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 7,
        'status'          => 1
    ],
    [
        'name'            => 'Zusätzlicher Bildlink',
        'content'         => '{p_popup_images}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 8,
        'status'          => 1
    ],
    [
        'name'            => 'Zustand',
        'content'         => '{p_google_export_condition}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 9,
        'status'          => 1
    ],
    [
        'name'            => 'Verfügbarkeit',
        'content'         => '{p_google_export_availability}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 10,
        'status'          => 1
    ],
    [
        'name'            => 'Preis',
        'content'         => '{p_google_price}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 11,
        'status'          => 1
    ],
    [
        'name'            => 'Sonderangebotspreis',
        'content'         => '{p_google_special_price}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 12,
        'status'          => 1
    ],
    [
        'name'            => 'Sonderangebotszeitraum',
        'content'         => '{p_special_period}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 13,
        'status'          => 1
    ],
    [
        'name'            => 'Marke',
        'content'         => '{brand_name|truncate:70:"..."}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 14,
        'status'          => 1
    ],
    [
        'name'            => 'GTIN',
        'content'         => '{p_google_export_gtin}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 15,
        'status'          => 1
    ],
    [
        'name'            => 'MPN',
        'content'         => '{code_mpn}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 16,
        'status'          => 1
    ],
    [
        'name'            => 'Kennzeichnung existiert',
        'content'         => '{p_google_identifier_exists}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 17,
        'status'          => 1
    ],
    [
        'name'            => 'Geschlecht',
        'content'         => '{gender}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 18,
        'status'          => 1
    ],
    [
        'name'            => 'Altersgruppe',
        'content'         => '{age_group}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 19,
        'status'          => 1
    ],
    [
        'name'            => 'Versandgewicht',
        'content'         => '{p_weight_gram} g',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 20,
        'status'          => 1
    ],
    [
        'name'            => 'Nicht jugendfrei',
        'content'         => '{p_google_fsk18}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 21,
        'status'          => 1
    ],
    [
        'name'            => 'Grundpreis Maß',
        'content'         => '{p_google_unit_price_measure}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 22,
        'status'          => 1
    ],
    [
        'name'            => 'Grundpreis Einheitsmaß',
        'content'         => '{p_google_unit_pricing_base_measure}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 23,
        'status'          => 1
    ],
    [
        'name'            => 'Verfallsdatum',
        'content'         => '{p_expiration_date}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 24,
        'status'          => 1
    ],
    [
        'name'            => 'Farbe',
        'content'         => '{collective_field||Farbe||attributes;additional_fields}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 25,
        'status'          => 1
    ],
    [
        'name'            => 'Größe',
        'content'         => '{collective_field||Größe||attributes;additional_fields}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 26,
        'status'          => 1
    ],
    [
        'name'            => 'Material',
        'content'         => '{collective_field||Material||attributes;additional_fields}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 27,
        'status'          => 1
    ],
    [
        'name'            => 'Muster',
        'content'         => '{collective_field||Muster||attributes;additional_fields}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 28,
        'status'          => 1
    ],
    [
        'name'            => 'Produktgruppe',
        'content'         => '{p_google_product_group}',
        'default_content' => '',
        'created_by'      => 'gambio',
        'sort_order'      => 29,
        'status'          => 1
    ]
];