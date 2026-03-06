<?php
/*--------------------------------------------------------------
   routes.php 2022-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

use Gambio\Api\Modules\ProductOption\App\Actions\CreateProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\DeleteAllProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\DeleteSpecificProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\FetchAllProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\FetchSpecificProductOptionAction;
use Gambio\Api\Modules\ProductOption\App\Actions\UpdateProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\PatchProductOptionsAction;
use Gambio\Core\Application\Routing\RouteCollector;

return static function(RouteCollector $routeCollector) {
    
    $routeCollector->get('/api.php/v3/products/{productId:[0-9]+}/options', FetchAllProductOptionsAction::class);
    $routeCollector->post('/api.php/v3/products/{productId:[0-9]+}/options', CreateProductOptionsAction::class);
    $routeCollector->put('/api.php/v3/products/{productId:[0-9]+}/options', UpdateProductOptionsAction::class);
    $routeCollector->patch('/api.php/v3/products/{productId:[0-9]+}/options', PatchProductOptionsAction::class);
    $routeCollector->delete('/api.php/v3/products/{productId:[0-9]+}/options', DeleteAllProductOptionsAction::class);
    
    $routeCollector->get('/api.php/v3/products/{productId:[0-9]+}/options/{optionId:[0-9]+}', FetchSpecificProductOptionAction::class);
    $routeCollector->delete('/api.php/v3/products/{productId:[0-9]+}/options/{optionIds:[0-9,]+}', DeleteSpecificProductOptionsAction::class);
};