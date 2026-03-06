<?php
/* --------------------------------------------------------------
   AfterbuyOrderRepository.php 2023-04-28
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\OrderExport\App\Data\AfterbuyOrder;

use Gambio\Core\Configuration\Services\ConfigurationFinder;
use GXModules\Gambio\Afterbuy\OrderExport\Model\OrderIds;
use GXModules\Gambio\Afterbuy\OrderExport\Model\Request\BuyerInfo;
use GXModules\Gambio\Afterbuy\OrderExport\Model\Request\Order;
use GXModules\Gambio\Afterbuy\OrderExport\Model\Request\Orders;
use GXModules\Gambio\Afterbuy\OrderExport\Model\Request\PaymentInfo;
use GXModules\Gambio\Afterbuy\OrderExport\Model\Request\ShippingAddress;
use GXModules\Gambio\Afterbuy\OrderExport\Model\Request\ShippingInfo;

/**
 * Class AfterbuyOrderRepository
 *
 * @package GXModules\Gambio\Afterbuy\OrderExport\App\Data
 */
class AfterbuyOrderRepository
{
    private AfterbuyOrderReader                $orderReader;
    private AfterbuyOrderShippingAddressMapper $shippingAddressMapper;
    private AfterbuyOrderPaymentInfoMapper     $paymentInfoMapper;
    private AfterbuyOrderShippingInfoMapper    $shippingInfoMapper;
    private ConfigurationFinder                $configurationFinder;
    private AfterbuyTaxHelper                  $taxHelper;
    
    
    /**
     * AfterbuyOrderRepository constructor.
     *
     * @param AfterbuyOrderReader                $orderReader
     * @param AfterbuyOrderShippingAddressMapper $shippingAddressMapper
     * @param AfterbuyOrderPaymentInfoMapper     $paymentInfoMapper
     * @param AfterbuyOrderShippingInfoMapper    $shippingInfoMapper
     */
    public function __construct(
        AfterbuyOrderReader                $orderReader,
        AfterbuyOrderShippingAddressMapper $shippingAddressMapper,
        AfterbuyOrderPaymentInfoMapper     $paymentInfoMapper,
        AfterbuyOrderShippingInfoMapper    $shippingInfoMapper,
        ConfigurationFinder                $configurationFinder,
        AfterbuyTaxHelper                  $taxHelper
    ) {
        $this->orderReader           = $orderReader;
        $this->shippingAddressMapper = $shippingAddressMapper;
        $this->paymentInfoMapper     = $paymentInfoMapper;
        $this->shippingInfoMapper    = $shippingInfoMapper;
        $this->configurationFinder   = $configurationFinder;
        $this->taxHelper             = $taxHelper;
    }
    
    
    public function getOrders(OrderIds $orderIds): Orders
    {
        $orders    = [];
        $orderData = $this->orderReader->getOrdersData($orderIds);
        foreach ($orderData as $data) {
            $shippingAddress = $this->shippingAddressMapper->map($data);
            
            $shippingTaxRate = 0;
            $mustAddTax = $this->taxHelper->mustAddTax((int)$data['customers_status']);
            $separateTax = (bool)($this->configurationFinder->get('modules/gambio/afterbuy/use_separate_tax') ?? true);
            if (!$separateTax && $mustAddTax) {
                [$shippingClass, $shippingSubclass] = explode("_", $data['shipping_class'] ?? '');
                $shippingTaxClassConfigKey = 'configuration/MODULE_SHIPPING_' . strtoupper($shippingClass)
                                             . '_TAX_CLASS';
                $shippingTaxClassId = (int)$this->configurationFinder->get($shippingTaxClassConfigKey);
                $shippingTaxRate = $this->taxHelper->getTaxRate($shippingTaxClassId,
                                                                $data['delivery_country'],
                                                                $data['delivery_state']);
            }
            
            $orderId = (int)$data['afterbuy_order_id'];
            // Todo: Check where value is available .. maybe for each order item?
            $itemId       = (int)$data['orders_id'];
            $buyerInfo    = new BuyerInfo($shippingAddress);
            $paymentInfo  = $this->paymentInfoMapper->map($data);
            $sendShippingInfo = (string)($this->configurationFinder->get('modules/gambio/afterbuy/send_shipping_info') ?? 'always');
            if ($sendShippingInfo !== 'always') {
                $data['shipping_method'] = '';
                $data['shipping_class'] = '';
            }
            $shippingInfo = $this->shippingInfoMapper->map($data, $shippingTaxRate);
            
            $order    = new Order($orderId,
                                  $itemId,
                                  $buyerInfo,
                                  $paymentInfo,
                                  $shippingInfo,
                // Todo: Check where value is available
                                  $additionalInfo = null,
                // Todo: Check where value is available
                                  $mailDate = null,
                // Todo: Check where value is available
                                  $reminderMailDate = null,
                // Todo: Check where value is available
                                  $userComment = null,
                // Todo: Check where value is available
                                  $orderMemo = null,
                // Todo: Check where value is available
                                  $invoiceMemo = null,
                // Todo: Check where value is available
                                  $invoiceNumber = null,
                // Todo: Check where value is available
                                  $orderExported = null,
                // Todo: Check where value is available
                                  $invoiceDate = null,
                // Todo: Check where value is available
                                  $hideOrder = null,
                // Todo: Check where value is available
                                  $reminderDateOne = null,
                // Todo: Check where value is available
                                  $reminderDateTwo = null,
                // Todo: Check where value is available
                                  $feedbackDate = null,
                // Todo: Check where value is available
                                  $xmlDate = null);
            $orders[] = $order;
        }
        
        // dummy return value
        return new Orders(...$orders);
    }
}