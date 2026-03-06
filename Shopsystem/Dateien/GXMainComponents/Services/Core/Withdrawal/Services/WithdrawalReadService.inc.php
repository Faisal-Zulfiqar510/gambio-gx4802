<?php
/* --------------------------------------------------------------
   WithdrawalReadService.inc.php 2018-01-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class WithdrawalReadService
 *
 * @category   System
 * @package    Withdrawal
 * @subpackage Services
 */
class WithdrawalReadService implements WithdrawalReadServiceInterface
{
    /**
     * @var \WithdrawalAccessRepositoryInterface
     */
    private $repository;
    
    
    /**
     * WithdrawalReadService constructor.
     *
     * @param \WithdrawalAccessRepositoryInterface $repository
     */
    public function __construct(WithdrawalAccessRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }
    
    
    /**
     * Returns withdrawal entities as collection.
     *
     * @return \WithdrawalCollection
     */
    public function getAll()
    {
        return $this->repository->getAll();
    }
    
    
    /**
     * Returns withdrawal entity by given id.
     *
     * @param \IdType $withdrawalId
     *
     * @return \Withdrawal
     */
    public function getById(IdType $withdrawalId)
    {
        return $this->repository->getById($withdrawalId);
    }
}
