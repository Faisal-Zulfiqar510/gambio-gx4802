<?php
/*--------------------------------------------------------------
   CreateProductOptionsAction.php 2022-10-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Actions\Json;

use Gambio\Admin\Modules\Option\Model\Entities\OptionValue;
use Gambio\Admin\Modules\Option\Model\ValueObjects\OptionValueId;
use Gambio\Admin\Modules\Option\Services\Exceptions\OptionDoesNotExistException;
use Gambio\Admin\Modules\Option\Services\OptionReadService as OptionReadServiceInterface;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\InsertionOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\ProductOptionAlreadyExistsException;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionRequestParser;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionRequestValidator;
use Gambio\Core\Application\Http\AbstractAction;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class CreateProductOptionsAction
 * @package Gambio\Admin\Modules\ProductOption\App\Actions\Json
 */
class CreateProductOptionsAction extends AbstractAction
{
    private const SORT_ORDER_PROVISIONAL_VALUE = -1;
    
    /**
     * @var ProductOptionRequestValidator
     */
    private ProductOptionRequestValidator $validator;
    
    /**
     * @var ProductOptionRequestParser
     */
    private ProductOptionRequestParser $parser;
    
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private ProductOptionWriteServiceInterface $writeService;
    
    /**
     * @var ProductOptionReadServiceInterface
     */
    private ProductOptionReadServiceInterface $readService;
    
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
     * @param ProductOptionRequestValidator   $validator
     * @param ProductOptionRequestParser      $parser
     * @param ProductOptionWriteServiceInterface $writeService
     * @param ProductOptionReadServiceInterface  $readService
     * @param OptionReadServiceInterface         $optionReadService
     * @param ProductPriceConversionService      $priceModifyService
     */
    public function __construct(
        ProductOptionRequestValidator $validator,
        ProductOptionRequestParser $parser,
        ProductOptionWriteServiceInterface $writeService,
        ProductOptionReadServiceInterface $readService,
        OptionReadServiceInterface $optionReadService,
        ProductPriceConversionService $priceModifyService
    ) {
        $this->validator          = $validator;
        $this->parser             = $parser;
        $this->writeService       = $writeService;
        $this->readService        = $readService;
        $this->optionReadService  = $optionReadService;
        $this->priceModifyService = $priceModifyService;
    }
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        $errors = $this->validator->validateCreationBody($request->getParsedBody());
    
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
            
            $optionIds = $this->writeService->createMultipleProductOptions(...$creationArguments);
        
            return $response->withStatus(200)->withJson(['data' => $optionIds->toArray()]);
        
        } catch (InsertionOfProductOptionsFailedException | ProductOptionAlreadyExistsException | OptionDoesNotExistException $exception) {
        
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
        $productOptions = $this->readService->getProductOptionsByProductId($productId);
        
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