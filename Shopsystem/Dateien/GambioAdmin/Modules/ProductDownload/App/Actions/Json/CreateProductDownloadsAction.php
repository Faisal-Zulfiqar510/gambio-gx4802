<?php
/*--------------------------------------------------------------
   CreateProductDownloadsAction.php 2022-10-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Actions\Json;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\Option\Model\Entities\OptionValue;
use Gambio\Admin\Modules\Option\Model\ValueObjects\OptionValueId;
use Gambio\Admin\Modules\Option\Services\Exceptions\OptionDoesNotExistException;
use Gambio\Admin\Modules\Option\Services\OptionReadService as OptionReadServiceInterface;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductDownload\Model\Exceptions\InsertionOfProductDownloadsFailedException;
use Gambio\Admin\Modules\ProductDownload\Model\Exceptions\ProductDownloadAlreadyExistsException;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadReadService as ProductDownloadReadServiceInterface;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadWriteService as ProductDownloadWriteServiceInterface;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductDownload\App\ProductDownloadRequestParser;
use Gambio\Admin\Modules\ProductDownload\App\ProductDownloadRequestValidator;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class CreateProductDownloadsAction
 * @package Gambio\Admin\Modules\ProductDownload\App\Actions\Json
 */
class CreateProductDownloadsAction extends AbstractProductDownloadAction
{
    private const SORT_ORDER_PROVISIONAL_VALUE = -1;
    
    /**
     * @var ProductDownloadRequestValidator
     */
    private ProductDownloadRequestValidator $validator;
    
    /**
     * @var ProductDownloadRequestParser
     */
    private ProductDownloadRequestParser $parser;
    
    /**
     * @var ProductDownloadWriteServiceInterface
     */
    private ProductDownloadWriteServiceInterface $writeService;
    
    /**
     * @var ProductDownloadReadServiceInterface
     */
    private ProductDownloadReadServiceInterface $readService;
    
    /**
     * @var int
     */
    private int $highestSortOrder;
    
    /**
     * @var OptionReadServiceInterface
     */
    private OptionReadServiceInterface $optionReadService;
    
    /**
     * @var ProductPriceConversionService
     */
    private ProductPriceConversionService $priceModifyService;
    
    
    /**
     * CreateProductOptionsAction constructor.
     *
     * @param ProductDownloadRequestValidator   $validator
     * @param ProductDownloadRequestParser      $parser
     * @param ProductDownloadWriteServiceInterface $writeService
     * @param ProductDownloadReadServiceInterface  $readService
     * @param Connection                           $connection
     * @param OptionReadServiceInterface           $optionReadService
     * @param ProductPriceConversionService        $priceModifyService
     */
    public function __construct(
        ProductDownloadRequestValidator $validator,
        ProductDownloadRequestParser $parser,
        ProductDownloadWriteServiceInterface $writeService,
        ProductDownloadReadServiceInterface $readService,
        Connection $connection,
        OptionReadServiceInterface $optionReadService,
        ProductPriceConversionService $priceModifyService
    ) {
        $this->validator          = $validator;
        $this->parser             = $parser;
        $this->writeService       = $writeService;
        $this->readService        = $readService;
        $this->optionReadService  = $optionReadService;
        $this->priceModifyService = $priceModifyService;
        $this->setConnection($connection);
    }
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        $errors = $this->validator->validateCreationBody($body = $request->getParsedBody());
    
        if (empty($errors) === false) {
        
            return $response->withStatus(400)->withJson(['errors' => $errors]);
        }
    
        $creationArguments = $this->parser->parseProductOptionsData($request, $errors);
    
        if (empty($errors) === false || empty($creationArguments) === true) {
        
            return $response->withStatus(422)->withJson(['errors' => $errors]);
        }
    
        try {
            if ($this->sortOrderMustBeOverwritten(...$creationArguments)) {
        
                $this->determineHighestSortOrderValue($request);
                $creationArguments = $this->overwriteSortOrder(...$creationArguments);
            }
    
            $this->applyOptionValueCustomization($creationArguments);
            
            $optionIds = $this->writeService->createMultipleProductDownloads(...$creationArguments);
    
            foreach ($optionIds as $index => $optionId) {
    
                [
                    'filePath'        => $filePath,
                    'maxCount'        => $maxCount,
                    'maxDays'         => $maxDays,
                ] = $body[$index];
                
                $this->assignDownloadData($optionId->value(), $filePath, $maxCount, $maxDays);
            }
        
            return $response->withStatus(200)->withJson(['data' => $optionIds->toArray()]);
        
        } catch (InsertionOfProductDownloadsFailedException | ProductDownloadAlreadyExistsException | OptionDoesNotExistException $exception) {
        
            return $response->withStatus(422)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
    
    /**
     * @param mixed ...$creationArguments
     *
     * @return bool
     */
    protected function sortOrderMustBeOverwritten(array ...$creationArguments): bool
    {
        foreach ($creationArguments as $arguments) {
            
            if ($arguments[5] === self::SORT_ORDER_PROVISIONAL_VALUE) {
                
                return true;
            }
        }
        
        return false;
    }
    
    
    /**
     * @param mixed ...$creationArguments
     *
     * @return array[]
     */
    private function overwriteSortOrder(array ...$creationArguments): array
    {
        foreach ($creationArguments as &$arguments) {
            
            if ($arguments[5] === self::SORT_ORDER_PROVISIONAL_VALUE) {
                
                $arguments[5] = ++$this->highestSortOrder;
            }
        }
        
        return $creationArguments;
    }
    
    /**
     * @param Request $request
     */
    private function determineHighestSortOrderValue(Request $request)
    {
        $sortOrder      = 0;
        $productId      = (int)$request->getAttribute('productId');
        $productOptions = $this->readService->getProductDownloadsByProductId($productId);
        
        foreach ($productOptions as $productOption) {
            
            if ($productOption->sortOrder() > $sortOrder) {
                
                $sortOrder = $productOption->sortOrder();
            }
        }
        
        $this->highestSortOrder = $sortOrder;
    }
    
    /**
     * @throws OptionDoesNotExistException
     */
    private function applyOptionValueCustomization(array &$creationArguments): void
    {
        foreach ($creationArguments as &$arguments) {
            /**
             * @var ProductId $productId
             */
            $productId = $arguments[0];
            /** @var OptionAndOptionValueId $optionAndOptionValueId */
            $optionAndOptionValueId = $arguments[1];
            /** @var OptionValueCustomization $customization */
            $customization = &$arguments[3];
            $optionValue = $this->optionValueById($optionAndOptionValueId);

            $customization = $customization->withPrice(
                $this->priceModifyService->getNetPrice(
                    $optionValue->price() !== 0.0 ? $optionValue->price() : $customization->price(),
                    $productId->value()
                )
            );


            if ($customization->weight() === 0.0 && $optionValue->weight() !== 0.0) {
                $customization = $customization->withWeight($optionValue->weight());
            }

            if (empty($customization->modelNumber()) && !empty($optionValue->modelNumber())) {
                $customization = $customization->withModelNumber($optionValue->modelNumber());
            }
        }
    }
    
    
    /**
     * @param OptionAndOptionValueId $optionAndOptionValueId
     *
     * @return OptionValue
     * @throws OptionDoesNotExistException
     */
    protected function optionValueById(OptionAndOptionValueId $optionAndOptionValueId): OptionValue
    {
        return $this->optionReadService->getOptionById($optionAndOptionValueId->optionId())
            ->values()
            ->getById(OptionValueId::create($optionAndOptionValueId->optionValueId()));
    }
}