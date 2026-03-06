<?php
/* --------------------------------------------------------------
 GoogleServiceProvider.php 2020-10-26
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

namespace GXModules\Gambio\Google\Admin\Module;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Layout\Renderer\GambioAdminLoader;
use Gambio\Core\Application\DependencyInjection\AbstractBootableServiceProvider;
use Gambio\Core\TextManager\Services\TextManager;

/**
 * Class GoogleServiceProvider
 *
 * @package GXModules\Gambio\Google\Admin\Module
 * @codeCoverageIgnore
 */
class GoogleServiceProvider extends AbstractBootableServiceProvider
{
    /**
     * @inheritDoc
     */
    public function provides(): array
    {
        return [
            GoogleFooterBadgeLoader::class,
            GoogleTranslationsLoader::class,
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $this->application->registerShared(GoogleFooterBadgeLoader::class)->addArgument(Connection::class);
        $this->application->registerShared(GoogleTranslationsLoader::class)->addArgument(TextManager::class);
    }
    
    
    public function boot(): void
    {
        $this->application->inflect(GambioAdminLoader::class)
            ->invokeMethod('addLoader', [GoogleFooterBadgeLoader::class]);
        $this->application->inflect(GambioAdminLoader::class)
            ->invokeMethod('addLoader', [GoogleTranslationsLoader::class]);
    }
}
