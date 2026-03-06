<?php
/*--------------------------------------------------------------------------------------------------
    AttachmentConfigurationServiceFactory.php 2022-03-25
    Gambio GmbH
    http://www.gambio.de
    Copyright (c) 2022 Gambio GmbH
    Released under the GNU General Public License (Version 2)
    [http://www.gnu.org/licenses/gpl-2.0.html]
    --------------------------------------------------------------------------------------------------
 */

declare(strict_types=1);

use Gambio\Core\Configuration\Services\ConfigurationService;

/**
 *
 */
class AttachmentConfigurationServiceFactory
{
    
    /**
     * Creates and returns an instance of AttachmentConfigurationService
     *
     * @return AttachmentConfigurationServiceInterface
     */
    public function createService(): AttachmentConfigurationServiceInterface
    {
        return MainFactory::create(
            'AttachmentConfigurationService',
            $this->createAttachmentConfigurationFactory(),
            $this->createConfigurationService()
        );
    }
    
    
    /**
     * Creates an instance of AttachmentConfigurationFactory
     *
     * @return AttachmentConfigurationFactory
     */
    private function createAttachmentConfigurationFactory(): AttachmentConfigurationFactory
    {
        return MainFactory::create('AttachmentConfigurationFactory');
    }
    
    
    /**
     * Creates an instance of ConfigurationService
     *
     * @return ConfigurationService
     */
    private function createConfigurationService(): ConfigurationService
    {
        return LegacyDependencyContainer::getInstance()->get(ConfigurationService::class);
    }
}