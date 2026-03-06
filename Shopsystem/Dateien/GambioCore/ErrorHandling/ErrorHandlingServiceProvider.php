<?php
/* --------------------------------------------------------------
   ErrorHandlingServiceProvider.php 2021-01-08
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\ErrorHandling;

use Gambio\Admin\Modules\UserFriendlyErrorPage\Services\UserFriendlyErrorPageErrorHandlerService;
use Gambio\Core\Application\DependencyInjection\AbstractServiceProvider;
use Gambio\Core\Application\ValueObjects\Environment;
use Gambio\Core\ErrorHandling\App\DebugDataProvider;
use Gambio\Core\ErrorHandling\Services\DefaultErrorHandler;
use Gambio\Core\Logging\LoggerBuilder;

/**
 * Class ErrorHandlingServiceProvider
 *
 * @package Gambio\Core\ErrorHandling
 */
class ErrorHandlingServiceProvider extends AbstractServiceProvider
{
    /**
     * @inheritDoc
     */
    public function provides(): array
    {
        return [
            DefaultErrorHandler::class,
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $this->application->registerShared(DebugDataProvider::class);
        
        $this->application->registerShared(DefaultErrorHandler::class, App\DefaultErrorHandler::class)
            ->addArgument(LoggerBuilder::class)
            ->addArgument(UserFriendlyErrorPageErrorHandlerService::class)
            ->addArgument(Environment::class)
            ->addArgument(DebugDataProvider::class);
    }
}